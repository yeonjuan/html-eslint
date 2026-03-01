/**
 * @import {AttributeValueAdapter} from "@html-eslint/core"
 * @import {
 *   Literal,
 *   TemplateLiteral
 * } from "../../types"
 */

const { AST_NODE_TYPES } = require("../../constants/node-types");
const { LiteralAttributeValueAdapter } = require("./literal");
const { TemplateLiteralAttributeValueAdapter } = require("./template-literal");

/**
 * @param {Literal | TemplateLiteral} node
 * @returns {AttributeValueAdapter}
 */
function createAttributeValueAdapter(node) {
  switch (node.type) {
    case AST_NODE_TYPES.Literal: {
      return new LiteralAttributeValueAdapter(node);
    }
    case AST_NODE_TYPES.TemplateLiteral: {
      return new TemplateLiteralAttributeValueAdapter(node);
    }
  }
}

module.exports = {
  createAttributeValueAdapter,
};
