/**
 * Rule-side helpers for branch-based duplicate suppression.
 *
 * The parser attaches a `branchSegments` array to the root Program node during
 * its branch-annotation pass (see packages/parser/lib/branch-annotation.js and
 * packages/parser/lib/parser.js).
 *
 * Each segment is: { groupId: number; branchIndex: number; start: number; end:
 * number }
 *
 * All segments that share the same `groupId` belong to one {% if %} block.
 * `branchIndex` is 0 for the if-body, 1 for the first elseif/else, etc. `start`
 * / `end` are character offsets into the original source (same coordinate space
 * as AST node `range` values).
 *
 * A set of nodes is "mutually exclusive" when, for every pair (A, B), there
 * exists at least one if-block group where both A and B fall inside it but in
 * _different_ branches. When every pair is exclusive the nodes can never all be
 * present in the rendered output simultaneously, so "duplicate" rules should
 * suppress their report.
 */

/** @import {Context} from "../../types" */

const { getSourceCode } = require("./source-code");

/**
 * Retrieve the pre-computed branch segments from the AST root. Returns an empty
 * array for non-HTML files or files parsed without a template engine syntax
 * configuration.
 *
 * `branchSegments` is attached dynamically to the Program node by
 * packages/parser/lib/parser.js and is not part of the standard typed Program
 * definition, so ast is cast to `any` to access it.
 *
 * @param {Context<any[]>} context
 * @returns {{
 *   groupId: number;
 *   branchIndex: number;
 *   start: number;
 *   end: number;
 * }[]}
 */
function getBranchSegments(context) {
  const { ast } = /** @type {{ ast: any }} */ (getSourceCode(context));
  return (ast && ast.branchSegments) || [];
}

/**
 * Retrieve the pre-computed branch-control token ranges from the AST root. Each
 * range is the [start, end] span of a template token that was classified as a
 * branch-control token (an `{% if %}`, `{% else %}`, `{% endif %}`, or similar
 * structural marker) as opposed to a plain value-interpolation token (e.g. `{{
 * name }}`).
 *
 * Rules use this to safely strip a branch-control token that ends up glued onto
 * the text of a following node (e.g. an attribute key) with no separating
 * whitespace, while continuing to treat a glued _interpolation_ token
 * conservatively (the name is genuinely dynamic and can't be compared).
 *
 * @param {Context<any[]>} context
 * @returns {[number, number][]}
 */
function getControlTokenRanges(context) {
  const { ast } = /** @type {{ ast: any }} */ (getSourceCode(context));
  return (ast && ast.branchControlRanges) || [];
}

/**
 * @param {[number, number]} range
 * @param {[number, number][]} controlTokenRanges
 * @returns {boolean}
 */
function isControlToken(range, controlTokenRanges) {
  return controlTokenRanges.some(
    ([start, end]) => start === range[0] && end === range[1]
  );
}

/**
 * Return true when every pair of nodes in `nodes` is located in different
 * branches of the same template if-block, meaning they can never all be present
 * in the rendered output at the same time.
 *
 * Each element of `nodes` must have a `.range` property ([start, end]).
 *
 * @param {{ range: [number, number] }[]} nodes
 * @param {{
 *   groupId: number;
 *   branchIndex: number;
 *   start: number;
 *   end: number;
 * }[]} branchSegments
 * @returns {boolean}
 */
function areInMutuallyExclusiveBranches(nodes, branchSegments) {
  if (nodes.length <= 1) return false;
  if (!branchSegments || branchSegments.length === 0) return false;

  // Group segments by their if-block groupId so we can query one block at a time.
  /** @type {Map<number, typeof branchSegments>} */
  const groups = new Map();
  for (const seg of branchSegments) {
    let list = groups.get(seg.groupId);
    if (!list) {
      list = [];
      groups.set(seg.groupId, list);
    }
    list.push(seg);
  }

  // For every pair (i, j), verify that at least one if-block group places
  // the two nodes in different branches.  If any pair has no such group, the
  // nodes are NOT all mutually exclusive and we must not suppress the report.
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const posA = nodes[i].range[0];
      const posB = nodes[j].range[0];
      let foundExclusiveGroup = false;

      for (const segments of groups.values()) {
        let branchA = -1;
        let branchB = -1;
        for (const seg of segments) {
          if (posA >= seg.start && posA < seg.end) branchA = seg.branchIndex;
          if (posB >= seg.start && posB < seg.end) branchB = seg.branchIndex;
        }
        // Both nodes must be *inside* this group's branches, but in different ones.
        if (branchA !== -1 && branchB !== -1 && branchA !== branchB) {
          foundExclusiveGroup = true;
          break;
        }
      }

      if (!foundExclusiveGroup) return false;
    }
  }

  return true;
}

module.exports = {
  getBranchSegments,
  getControlTokenRanges,
  isControlToken,
  areInMutuallyExclusiveBranches,
};
