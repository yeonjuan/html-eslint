/**
 * @typedef {import("./types").ParserOptions} ParserOptions
 * @typedef {import("eslint").AST.Program} Program
 */
const { parse, TokenTypes } = require("es-html-parser");
const { visitorKeys } = require("./visitor-keys");
const { traverse } = require("./traverse");
const { NODE_TYPES } = require("./node-types");
const { getOptions } = require("./options");

/**
 * @param {string} code
 * @param {ParserOptions | undefined} parserOptions
 * @returns {any}
 */
module.exports.parseForESLint = function parseForESLint(code, parserOptions) {
  const { options, html } = getOptions(code, parserOptions);
  const { ast, tokens } = parse(html, options);

  /**
   * @type {Program}
   */
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
    /**
     *
     */
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
  });

  return {
    ast: programNode,
    visitorKeys,
    scopeManager: null,
  };
};
