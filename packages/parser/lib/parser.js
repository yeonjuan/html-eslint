/**
 * @import {AST} from "eslint"
 * @import {ParserOptions} from "./types"
 */
const { parse, TokenTypes } = require("es-html-parser");
const { visitorKeys } = require("./visitor-keys");
const { traverse, traverseCss } = require("./traverse");
const { NODE_TYPES } = require("./node-types");
const { getOptions } = require("./options");
const { parse: parseCSS, toPlainObject } = require("css-tree");

/**
 * @param {string} code
 * @param {ParserOptions | undefined} parserOptions
 * @returns {import("eslint").Linter.ESLintParseResult}
 */
module.exports.parseForESLint = function parseForESLint(code, parserOptions) {
  const { options, html } = getOptions(code, parserOptions);
  const { ast, tokens } = parse(html, options);

  /** @type {AST.Program} */
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

  traverse(programNode, (node) => {
    if (node.type === NODE_TYPES.CommentContent) {
      programNode.comments.push({
        // @ts-ignore
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
    ast: programNode,
    visitorKeys,
    scopeManager: undefined,
  };
};
