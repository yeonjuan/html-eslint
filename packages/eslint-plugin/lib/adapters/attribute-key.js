/**
 * @import {AttributeKeyAdapter} from "@html-eslint/core"
 * @import {AttributeKey} from "@html-eslint/types"
 */

const { hasTemplate } = require("../rules/utils/node");

/** @implements {AttributeKeyAdapter} */
class HTMLAttributeKeyAdapter {
  /** @param {AttributeKey} node */
  constructor(node) {
    this.node = node;
  }

  getValue() {
    return this.node.value;
  }

  hasExpression() {
    return hasTemplate(this.node);
  }

  getRange() {
    return this.node.range;
  }

  getLocation() {
    return this.node.loc;
  }
}

module.exports = {
  HTMLAttributeKeyAdapter,
};
