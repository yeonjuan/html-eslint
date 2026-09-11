/**
 * @import {AttributeAdapter} from "@html-eslint/core"
 * @import {SourceLocation} from "@html-eslint/types"
 * @import {JSXSpreadAttribute} from "../../types"
 */

/** @implements {AttributeAdapter} */
class JSXSpreadAttributeAdapter {
  /** @param {JSXSpreadAttribute} node */
  constructor(node) {
    this.node = node;
  }

  getKey() {
    return null;
  }

  getValue() {
    return null;
  }

  /** @returns {SourceLocation} */
  getLocation() {
    return this.node.loc;
  }
}

module.exports = {
  JSXSpreadAttributeAdapter,
};
