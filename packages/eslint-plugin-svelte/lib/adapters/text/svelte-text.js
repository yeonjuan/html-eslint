/**
 * @import {TextAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {SvelteText} from "../../types"
 */

/** @implements {TextAdapter} */
export class SvelteTextAdapter {
  /** @param {SvelteText} node */
  constructor(node) {
    this.node = node;
  }

  /** @returns {SourceLocation} */
  getLocation() {
    return this.node.loc;
  }

  /** @returns {Range} */
  getRange() {
    return this.node.range;
  }

  getValue() {
    return this.node.value;
  }
}
