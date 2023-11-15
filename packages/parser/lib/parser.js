/**
 * @typedef {import("./types").ProgramNode} ProgramNode
 */
const { parse } = require("es-html-parser");
const { visitorKeys } = require("./visitor-keys");
const { traverse } = require("./traverse");
const { NODE_TYPES } = require("./node-types");

/**
 * @param {string} code
 * @returns {ProgramNode}
 */
module.exports.parseForESLint = function parseForESLint(code) {
  const { ast, tokens } = parse(code);

  const programNode = {
    type: "Program",
    body: ast.children,
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
