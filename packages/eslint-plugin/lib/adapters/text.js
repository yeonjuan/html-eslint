/**
 * @import {TextAdapter} from "@html-eslint/core"
 * @import {Text} from "@html-eslint/types"
 */

/** @implements {TextAdapter} */
class HTMLTextAdapter {
  /** @param {Text} node */
  constructor(node) {
    this.node = node;
  }

  getValue() {
    return this.node.value;
  }

  getRange() {
    return this.node.range;
  }

  getLocation() {
    return this.node.loc;
  }
}

module.exports = {
  HTMLTextAdapter,
};
