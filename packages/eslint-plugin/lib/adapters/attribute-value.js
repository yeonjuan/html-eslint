/**
 * @import {AttributeValueAdapter} from "@html-eslint/core"
 * @import {AttributeValue} from "@html-eslint/types"
 */

/** @implements {AttributeValueAdapter} */
class HTMLAttributeValueAdapter {
  /** @param {AttributeValue} node */
  constructor(node) {
    this.node = node;
  }

  getLocation() {
    return this.node.loc;
  }

  getRange() {
    return this.node.range;
  }

  hasExpression() {
    return !!this.node.parts.length;
  }

  getValue() {
    return this.node.value;
  }
}

module.exports = {
  HTMLAttributeValueAdapter,
};
