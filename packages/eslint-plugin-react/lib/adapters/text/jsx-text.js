/**
 * @import {TextAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {JSXText} from "../../types"
 */

/** @implements {TextAdapter} */
class JSXTextAdapter {
  /** @param {JSXText} node */
  constructor(node) {
    this.node = node;
  }

  getValue() {
    return this.node.value;
  }

  /** @returns {Range} */
  getRange() {
    return this.node.range;
  }

  /** @returns {SourceLocation} */
  getLocation() {
    return this.node.loc;
  }
}

module.exports = {
  JSXTextAdapter,
};
