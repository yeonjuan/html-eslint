/**
 * @import {ElementAdapter} from "@html-eslint/core"
 * @import {
 *   AttributeValue,
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 */

const { NODE_TYPES } = require("@html-eslint/parser");
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

  getParentContainer() {
    const { parent } = this.node;
    if (!parent || parent.type === NODE_TYPES.Document) {
      return null;
    }
    if (parent.type === NODE_TYPES.Tag) {
      return { name: getNameOf(parent), isCustomElement: false };
    }
    // e.g. a Fragment root when parsing a JS/Lit template literal - the
    // real parent can't be determined statically.
    return { name: "", isCustomElement: true };
  }
}

module.exports = {
  HTMLElementAdapter,
};
