/**
 * @import {AttributeAdapter} from "@html-eslint/core"
 * @import {Attribute} from "@html-eslint/types"
 */

const { HTMLAttributeKeyAdapter } = require("./attribute-key");
const { HTMLAttributeValueAdapter } = require("./attribute-value");

/** @implements {AttributeAdapter} */
class HTMLAttributeAdapter {
  /** @param {Attribute} node */
  constructor(node) {
    this.node = node;
  }

  getKey() {
    return new HTMLAttributeKeyAdapter(this.node.key);
  }

  getValue() {
    if (!this.node.value) {
      return null;
    }
    return new HTMLAttributeValueAdapter(this.node.value);
  }
}

module.exports = {
  HTMLAttributeAdapter,
};
