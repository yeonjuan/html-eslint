/**
 * @import {AttributeKeyAdapter} from "@html-eslint/core"
 * @import {Range} from "@html-eslint/types"
 * @import {SvelteName} from "../../types"
 */

/** @implements {AttributeKeyAdapter} */
export class SvelteNameAttributeKeyAdapter {
  /** @param {SvelteName} node */
  constructor(node) {
    this.node = node;
  }

  getLocation() {
    return this.node.loc;
  }

  getValue() {
    return this.node.name;
  }

  hasExpression() {
    return false;
  }

  getRange() {
    return /** @type {Range} */ (this.node.range);
  }
}
