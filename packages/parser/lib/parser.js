/**
 * @import {TemplateSyntax} from "@html-eslint/template-syntax-parser"
 * @import {Linter} from "eslint"
 * @import {
 *   HTMLProgram,
 *   ParserOptions
 * } from "./types"
 */
const { parse, TokenTypes } = require("es-html-parser");
const { visitorKeys } = require("./visitor-keys");
const { traverse, traverseCss } = require("./traverse");
const { NODE_TYPES } = require("./node-types");
const { getOptions } = require("./options");
const { parse: parseCSS, toPlainObject } = require("css-tree");
const {
  computeBranchSegments,
  getControlTokenRanges,
} = require("./branch-annotation");

/**
 * @param {string} code
 * @param {ParserOptions | undefined} parserOptions
 * @returns {Linter.ESLintParseResult}
 */
module.exports.parseForESLint = function parseForESLint(code, parserOptions) {
  const { options, html, syntaxItems, frontmatterOffset } = getOptions(
    code,
    parserOptions
  );
  const { ast, tokens } = parse(html, options);

  /** @type {HTMLProgram} */
  const programNode = {
    type: "Program",
    // @ts-ignore
    body: [ast],
    loc: ast.loc,
    range: ast.range,
    // @ts-ignore
    tokens: tokens.filter(
      (token) =>
        token.type !== TokenTypes.CommentContent &&
        token.type !== TokenTypes.CommentOpen &&
        token.type !== TokenTypes.CommentClose
    ),
    comments: [],
  };

  // Compute branch segments from the template token list produced by
  // @html-eslint/template-syntax-parser.  Rules (no-duplicate-id, etc.) read
  // these segments to decide whether "duplicate" nodes are actually confined
  // to mutually exclusive runtime branches.
  //
  // templateInfos ranges are relative to `html` (frontmatter-stripped source).
  // AST node ranges are relative to the original `code` (via tokenAdapter).
  // We therefore add frontmatterOffset to each segment after computing them.
  // options.templateInfos is typed as TemplateInfo[] by es-html-parser's
  // declarations, but at runtime it is always TemplateSyntax[] produced by
  // @html-eslint/template-syntax-parser.  The cast is safe.
  const templateInfos = /** @type {TemplateSyntax[]} */ (
    (options && options.templateInfos) || []
  );

  if (templateInfos.length > 0 && syntaxItems.length > 0) {
    const rawSegments = computeBranchSegments(templateInfos, html, syntaxItems);
    const rawControlRanges = getControlTokenRanges(
      templateInfos,
      html,
      syntaxItems
    );
    // @ts-ignore — branchSegments is not part of the typed HTMLProgram
    // definition, but rules access it dynamically via sourceCode.ast.
    programNode.branchSegments =
      frontmatterOffset === 0
        ? rawSegments
        : rawSegments.map((seg) => ({
            groupId: seg.groupId,
            branchIndex: seg.branchIndex,
            start: seg.start + frontmatterOffset,
            end: seg.end + frontmatterOffset,
          }));
    // @ts-ignore — branchControlRanges is not part of the typed HTMLProgram
    // definition. Rules use it to tell a branch-control template token
    // (e.g. {% if %} / {% else %} / {% endif %}) apart from a plain
    // value-interpolation token (e.g. {{ name }}) when a template token
    // ends up glued onto adjacent text with no separating whitespace.
    programNode.branchControlRanges =
      frontmatterOffset === 0
        ? rawControlRanges
        : rawControlRanges.map(([start, end]) => [
            start + frontmatterOffset,
            end + frontmatterOffset,
          ]);
  } else {
    // @ts-ignore
    programNode.branchSegments = [];
    // @ts-ignore
    programNode.branchControlRanges = [];
  }

  traverse(programNode, (node) => {
    if (node.type === NODE_TYPES.CommentContent) {
      programNode.comments.push({
        type: node.type,
        range: node.range,
        loc: node.loc,
        value: node.value,
      });
    }
    if (node.type === NODE_TYPES.StyleTagContent) {
      const cssNode = toPlainObject(
        parseCSS(node.value, {
          context: "stylesheet",
          offset: node.range[0],
          positions: true,
          line: node.loc.start.line,
          // css-tree uses 1-base column.
          column: node.loc.start.column + 1,
        })
      );
      traverseCss(cssNode, (node) => {
        node.type = `Css${node.type}`;
        if (node.loc) {
          node.range = [node.loc.start.offset, node.loc.end.offset];
          node.loc.start.column -= 1;
          node.loc.end.column -= 1;
        }
      });
      // @ts-ignore
      node.stylesheet = cssNode;
    }
  });

  return {
    // @ts-ignore
    ast: programNode,
    visitorKeys,
    scopeManager: undefined,
  };
};
