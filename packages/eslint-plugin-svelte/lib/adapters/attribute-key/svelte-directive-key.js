/**
 * @import {AttributeKeyAdapter} from "@html-eslint/core"
 * @import {Range} from "@html-eslint/types"
 * @import {SvelteDirectiveKey} from "../../types"
 */

/** @implements {AttributeKeyAdapter} */
export class SvelteDirectiveKeyAttributeKeyAdapter {
  /** @param {SvelteDirectiveKey} node */
  constructor(node) {
    this.node = node;
  }

  getLocation() {
    return this.node.loc;
  }

  getValue() {
    return "";
  }

  hasExpression() {
    return true;
  }

  getRange() {
    return /** @type {Range} */ (this.node.name.range);
  }
}
