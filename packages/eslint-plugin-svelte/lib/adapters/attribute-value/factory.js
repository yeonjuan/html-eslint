/**
 * @import {AttributeValueAdapter} from "@html-eslint/core"
 * @import {
 *   Literal,
 *   SvelteLiteral,
 *   SvelteMustacheTagText,
 *   TemplateLiteral
 * } from "../../types"
 */

const { AST_NODE_TYPES } = require("../../constants/node-types");
const { LiteralAttributeValueAdapter } = require("./literal");
const { SvelteLiteralAttributeValueAdapter } = require("./svelte-literal");
const {
  SvelteMustacheTagTextValueAdapter,
} = require("./svelte-mustache-tag-text");
const { TemplateLiteralAttributeValueAdapter } = require("./template-literal");

/**
 * @param {Literal
 *   | TemplateLiteral
 *   | SvelteLiteral
 *   | SvelteMustacheTagText} node
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
    case AST_NODE_TYPES.SvelteLiteral: {
      return new SvelteLiteralAttributeValueAdapter(node);
    }
    case AST_NODE_TYPES.SvelteMustacheTag: {
      return new SvelteMustacheTagTextValueAdapter(node);
    }
  }
}

module.exports = {
  createAttributeValueAdapter,
};
