/**
 * @typedef {import("./types").ParserOptions} ParserOptions
 */
const { parse } = require("es-html-parser");
const { visitorKeys } = require("./visitor-keys");
const { traverse } = require("./traverse");
const { NODE_TYPES } = require("./node-types");
const templateSyntaxParser = require("@html-eslint/template-syntax-parser");

/**
 * @param {string} code
 * @param {ParserOptions | undefined} parserOptions
 * @returns {any}
 */
module.exports.parseForESLint = function parseForESLint(code, parserOptions) {
  const options =
    (parserOptions &&
      parserOptions.templateEngineSyntax && {
        templateInfos: templateSyntaxParser.parse(code, {
          syntax: parserOptions.templateEngineSyntax,
        }).syntax,
      }) ||
    undefined;

  const { ast, tokens } = parse(code, options);

  const programNode = {
    type: "Program",
    body: [ast],
    loc: ast.loc,
    range: ast.range,
    tokens: tokens.filter(
      (token) =>
        token.type !== NODE_TYPES.CommentContent &&
        token.type !== NODE_TYPES.CommentOpen &&
        token.type !== NODE_TYPES.CommentClose
    ),
    comments: [],
  };

  traverse(programNode, (node) => {
    if (node.type === NODE_TYPES.CommentContent) {
      programNode.comments.push({
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
