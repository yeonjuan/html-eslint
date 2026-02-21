/**
 * @import {
 *   Literal,
 *   Node,
 *   TemplateLiteral
 * } from "../../types"
 */
const { AST_NODE_TYPES } = require("../../constants/node-types");

/**
 * Check if a node represents a static string value
 *
 * A node is considered a static string if it's either:
 *
 * - A Literal node (e.g., "foo", 'bar')
 * - A TemplateLiteral without any expressions (e.g., `foo`)
 *
 * @example
 *   isStaticString("foo"); // true - Literal
 *   isStaticString(`bar`); // true - TemplateLiteral without expressions
 *   isStaticString(`${foo}`); // false - has expression
 *   isStaticString(someVariable); // false - not a string literal
 *
 * @param {Node} node - The AST node to check
 * @returns {node is Literal | TemplateLiteral} True if the node is a static
 *   string
 */
function isStaticString(node) {
  return (
    (node.type === AST_NODE_TYPES.Literal && typeof node.value === "string") ||
    (node.type === AST_NODE_TYPES.TemplateLiteral &&
      node.expressions.length === 0 &&
      node.quasis.length === 1)
  );
}

module.exports = {
  isStaticString,
};
