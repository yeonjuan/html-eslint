/** @import {SyntaxConfig} from "@html-eslint/template-syntax-parser" */

/**
 * Branch configuration for a template block delimiter.
 *
 * The template-syntax-parser ignores unknown properties on SyntaxConfigItem,
 * so adding `branch` here is fully backwards-compatible.
 *
 * Patterns are matched against the raw content between the opening and closing
 * delimiters of each template token, e.g. the content of `{% if foo %}` is
 * " if foo " (including surrounding whitespace).
 *
 * @typedef {{
 *   start:       RegExp;   // matches if-opening tokens  (e.g. " if cond ")
 *   continue:    RegExp;   // matches branch-separator tokens (elseif / else)
 *   end:         RegExp;   // matches if-closing tokens  (e.g. " endif ")
 *   blockOpen?:  RegExp;   // matches other block-openers (for, macro, …)
 *   blockClose?: RegExp;   // matches the matching closers (endfor, endmacro, …)
 * }} BranchConfig
 *
 * blockOpen / blockClose are needed to prevent an `else` or `elif` that
 * belongs to a `for` / `macro` / etc. block from being misclassified as an
 * `else` belonging to an enclosing `if` block.
 */

// ---------------------------------------------------------------------------
// HANDLEBAR
// ---------------------------------------------------------------------------

/** @type {SyntaxConfig} */
const HANDLEBAR = {
  "{{": "}}",
};

/**
 * Handlebars with conditional branch-awareness.
 * Use this instead of HANDLEBAR when you want duplicate nodes that appear in
 * separate `{{#if}}` / `{{else}}` branches to be silently ignored.
 *
 * Must be used as an array (SyntaxConfigItem[]) rather than the shorthand
 * Record form, because the Record form has no place to carry branch patterns.
 *
 * @type {Array<{ open: string; close: string; branch: BranchConfig }>}
 */
const HANDLEBAR_EXTENDED = [
  {
    open: "{{",
    close: "}}",
    branch: {
      start:      /^\s*#if\b/,
      continue:   /^\s*else\b/,
      end:        /^\s*\/if\b/,
      // Any block helper other than #if / /if may carry its own {{else}}.
      blockOpen:  /^\s*#(?!if\b)/,
      blockClose: /^\s*\/(?!if\b)/,
    },
  },
];

// ---------------------------------------------------------------------------
// TWIG
// ---------------------------------------------------------------------------

/**
 * Twig branch patterns.
 * Handles optional whitespace-control dashes: {%- ... -%}
 * The `-` appears as the first non-space character of the token content.
 *
 * @type {BranchConfig}
 */
const TWIG_BRANCH = {
  start:      /^\s*-?\s*if\b/,
  continue:   /^\s*-?\s*(elseif|else)\b/,
  end:        /^\s*-?\s*endif\b/,
  blockOpen:  /^\s*-?\s*(for|block|macro|embed|autoescape|sandbox|with)\b/,
  blockClose: /^\s*-?\s*end(for|block|macro|embed|autoescape|sandbox|with)\b/,
};

/** @type {Array<{ open: string; close: string; isComment?: boolean; branch?: BranchConfig }>} */
const TWIG = [
  { open: "{{", close: "}}" },
  { open: "{%", close: "%}", branch: TWIG_BRANCH },
  { open: "{#", close: "#}", isComment: true },
];

// ---------------------------------------------------------------------------
// NUNJUCKS
// Identical delimiter syntax to Twig but uses `elif` instead of `elseif`,
// and its block keyword inventory differs slightly.
// ---------------------------------------------------------------------------

/** @type {Array<{ open: string; close: string; isComment?: boolean; branch?: BranchConfig }>} */
const NUNJUCKS = [
  { open: "{{", close: "}}" },
  {
    open: "{%",
    close: "%}",
    branch: {
      start:      /^\s*-?\s*if\b/,
      continue:   /^\s*-?\s*(elif|else)\b/,
      end:        /^\s*-?\s*endif\b/,
      blockOpen:  /^\s*-?\s*(for|block|macro|call|set)\b/,
      blockClose: /^\s*-?\s*end(for|block|macro|call|set)\b/,
    },
  },
  { open: "{#", close: "#}", isComment: true },
];

// ---------------------------------------------------------------------------
// ERB
// Not branch-aware: ERB's `end` keyword is shared by every block type
// (if, unless, while, each, …), making reliable if-block tracking impossible
// without a full Ruby expression parser.
// ---------------------------------------------------------------------------

/** @type {SyntaxConfig} */
const ERB = {
  "<%": "%>",
};

module.exports = {
  HANDLEBAR,
  HANDLEBAR_EXTENDED,
  TWIG,
  NUNJUCKS,
  ERB,
};
