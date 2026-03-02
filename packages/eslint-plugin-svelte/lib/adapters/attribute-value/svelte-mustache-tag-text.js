/**
 * @import {AttributeValueAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {
 *   Literal,
 *   SvelteMustacheTagText,
 *   TemplateLiteral
 * } from "../../types"
 */

const { AST_NODE_TYPES } = require("../../constants/node-types");
const { LiteralAttributeValueAdapter } = require("./literal");
const { TemplateLiteralAttributeValueAdapter } = require("./template-literal");

/** @implements {AttributeValueAdapter} */
class SvelteMustacheTagTextValueAdapter {
  /** @param {SvelteMustacheTagText} node */
  constructor(node) {
    this.node = node;
    this.adapter = this.getAdapter();
  }

  getAdapter() {
    if (this.node.expression.type === AST_NODE_TYPES.Literal) {
      return new LiteralAttributeValueAdapter(
        /** @type {Literal} */ (this.node.expression)
      );
    }
    if (this.node.expression.type === AST_NODE_TYPES.TemplateLiteral) {
      return new TemplateLiteralAttributeValueAdapter(
        /** @type {TemplateLiteral} */ (this.node.expression)
      );
    }
    return null;
  }

  /** @returns {SourceLocation} */
  getLocation() {
    return this.adapter?.getLocation() ?? this.node.loc;
  }

  /** @returns {Range} */
  getRange() {
    return this.adapter?.getRange() ?? this.node.range;
  }

  hasExpression() {
    return !this.adapter;
  }

  getValue() {
    return this.adapter?.getValue() ?? null;
  }
}

module.exports = {
  SvelteMustacheTagTextValueAdapter,
};
