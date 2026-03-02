/**
 * @import {ElementAdapter} from "@html-eslint/core"
 * @import {
 *   AttributeValue,
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 */

const { getNameOf } = require("../rules/utils/node");
const { HTMLAttributeAdapter } = require("./attribute");

/** @implements {ElementAdapter} */
class HTMLElementAdapter {
  /** @param {Tag | ScriptTag | StyleTag} node */
  constructor(node) {
    this.node = node;
  }

  getLocation() {
    return this.node.loc;
  }

  getRange() {
    return this.node.range;
  }

  getElementName() {
    return getNameOf(this.node);
  }

  getOpenStartLocation() {
    return this.node.openStart.loc;
  }

  getOpenStartRange() {
    return this.node.openStart.range;
  }

  getAttributes() {
    return this.node.attributes.map(
      (attribute) => new HTMLAttributeAdapter(attribute)
    );
  }
}

module.exports = {
  HTMLElementAdapter,
};
