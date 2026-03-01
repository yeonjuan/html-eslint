/**
 * @import {
 *   Literal,
 *   TemplateLiteral
 * } from "../../types"
 */

import { AST_NODE_TYPES } from "../../constants/node-types";

/**
 * @param {unknown} node
 * @returns {node is Literal}
 */
export function isLiteral(node) {
  return (
    typeof node === "object" &&
    !!node &&
    "type" in node &&
    node.type === AST_NODE_TYPES.Literal
  );
}

/**
 * @param {unknown} node
 * @returns {node is TemplateLiteral}
 */
export function isTemplateLiteral(node) {
  return (
    typeof node === "object" &&
    !!node &&
    "type" in node &&
    node.type === AST_NODE_TYPES.TemplateLiteral
  );
}
