/** @import {TemplateSyntax} from "@html-eslint/template-syntax-parser" */

/**
 * Branch annotation for @html-eslint/parser.
 *
 * @typedef {{
 *   groupId: number;
 *   branchIndex: number;
 *   start: number;
 *   end: number;
 * }} BranchSegment
 * @html-eslint/template-syntax-parser already records every template token as
 * an opaque {open, close} range pair.  This module classifies those tokens
 * (using per-engine patterns stored in the SyntaxConfigItem.branch property)
 * and emits a flat list of BranchSegment objects.
 *
 * A BranchSegment represents one branch body of one {% if %} block:
 *   groupId      — same for all branches of the same if-block
 *   branchIndex  — 0 for the if-body, 1 for first elseif/else, etc.
 *   start / end  — source character range of the branch content (exclusive of
 *                  the template tokens themselves)
 *
 * Rules can use these segments to decide whether two "duplicate" nodes are
 * actually unreachable simultaneously, because every path through the template
 * can only enter one branch of any given if-block.
 */

/**
 * @param {RegExp | string | undefined} pattern
 * @param {string} content
 * @returns {boolean}
 */
function matches(pattern, content) {
  if (!pattern) return false;
  if (pattern instanceof RegExp) return pattern.test(content);
  return content.indexOf(pattern) !== -1;
}

/**
 * Compute branch segments from a list of template token ranges.
 *
 * @param {TemplateSyntax[]} templateInfos The TemplateSyntax[] returned by
 *   `@html-eslint/template-syntax-parser`. Each entry covers one complete
 *   template token: open is the [start,end] of the opening delimiter, close is
 *   the [start,end] of the closing delimiter. Content lives between open[1] and
 *   close[0].
 * @param {string} source The source text that templateInfos was parsed from.
 *   Must be the same string (same character offsets) — i.e. the
 *   frontmatter-stripped `html` string from getOptions(), NOT the full `code`
 *   string. The caller is responsible for adding any frontmatter offset to the
 *   returned segments.
 * @param {{
 *   open: string;
 *   close: string;
 *   branch?: {
 *     start: RegExp | string;
 *     continue: RegExp | string;
 *     end: RegExp | string;
 *     blockOpen?: RegExp | string;
 *     blockClose?: RegExp | string;
 *   };
 * }[]} syntaxItems
 *   Normalized SyntaxConfigItem array. Only items that have a .branch property
 *   are consulted; the rest are ignored.
 * @returns {BranchSegment[]}
 */
function computeBranchSegments(templateInfos, source, syntaxItems) {
  // Fast exit: nothing to do without branch-aware items.
  /** @type {Map<string, (typeof syntaxItems)[number]>} */
  const itemByOpen = new Map();
  for (const item of syntaxItems) {
    if (item.branch) {
      itemByOpen.set(item.open, item);
    }
  }
  if (itemByOpen.size === 0) return [];

  // --- 1. Classify every token that belongs to a branch-aware delimiter. ---

  /**
   * @type {{
   *   role: "START" | "CONTINUE" | "END" | "BLOCK_OPEN" | "BLOCK_CLOSE";
   *   tokenStart: number;
   *   tokenEnd: number;
   * }[]}
   */
  const classified = [];

  for (const info of templateInfos) {
    const openDelim = source.slice(info.open[0], info.open[1]);
    const item = itemByOpen.get(openDelim);
    if (!item || !item.branch) continue;

    // Content between the opening and closing delimiters, e.g. " if cond ".
    const content = source.slice(info.open[1], info.close[0]);
    const b = item.branch;

    /**
     * @type {"START"
     *   | "CONTINUE"
     *   | "END"
     *   | "BLOCK_OPEN"
     *   | "BLOCK_CLOSE"
     *   | null}
     */
    let role = null;
    // Order matters: END before CONTINUE so that patterns like
    // /^\s*-?\s*(elseif|else)\b/ don't accidentally match "endif" (they won't
    // with these specific patterns, but being explicit is safer).
    if (matches(b.start, content)) {
      role = "START";
    } else if (matches(b.end, content)) {
      role = "END";
    } else if (matches(b.continue, content)) {
      role = "CONTINUE";
    } else if (b.blockOpen && matches(b.blockOpen, content)) {
      role = "BLOCK_OPEN";
    } else if (b.blockClose && matches(b.blockClose, content)) {
      role = "BLOCK_CLOSE";
    }

    if (role) {
      classified.push({
        role,
        tokenStart: info.open[0],
        tokenEnd: info.close[1],
      });
    }
  }

  if (classified.length === 0) return [];

  // template-syntax-parser emits tokens in source order, but sort defensively.
  classified.sort((a, b) => a.tokenStart - b.tokenStart);

  // --- 2. Stack-based pass to build BranchSegments. ---
  //
  // Stack entries are one of two shapes:
  //   { type: 'if',    groupId, branchIndex, segmentStart }
  //   { type: 'block' }
  //
  // The 'block' entries represent non-if blocks (for, macro, etc.) that may
  // themselves contain an `else` clause.  By tracking them on the same stack
  // we ensure that an `else` or `elseif` token is only credited to the
  // nearest enclosing `if`, not to an outer one.

  /** @type {BranchSegment[]} */
  const segments = [];
  let groupId = 0;
  /**
   * @type {(
   *   | {
   *       type: "if";
   *       groupId: number;
   *       branchIndex: number;
   *       segmentStart: number;
   *     }
   *   | { type: "block" }
   * )[]}
   */
  const stack = [];

  for (const token of classified) {
    const top = stack.length > 0 ? stack[stack.length - 1] : null;

    switch (token.role) {
      case "START":
        stack.push({
          type: "if",
          groupId: groupId++,
          branchIndex: 0,
          segmentStart: token.tokenEnd,
        });
        break;

      case "BLOCK_OPEN":
        stack.push({ type: "block" });
        break;

      case "CONTINUE":
        // Only process when the immediately enclosing block is an if-block.
        // A CONTINUE inside {% for %}...{% else %}...{% endfor %} will have
        // a 'block' entry on top → ignored, so the outer if-block is safe.
        if (top && top.type === "if") {
          segments.push({
            groupId: top.groupId,
            branchIndex: top.branchIndex,
            start: top.segmentStart,
            end: token.tokenStart,
          });
          top.branchIndex++;
          top.segmentStart = token.tokenEnd;
        }
        break;

      case "END":
        if (top && top.type === "if") {
          stack.pop();
          segments.push({
            groupId: top.groupId,
            branchIndex: top.branchIndex,
            start: top.segmentStart,
            end: token.tokenStart,
          });
        }
        break;

      case "BLOCK_CLOSE":
        if (top && top.type === "block") {
          stack.pop();
        }
        break;
    }
  }

  return segments;
}

module.exports = {
  computeBranchSegments,
};
