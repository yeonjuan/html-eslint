/**
 * @import {AttributeKeyAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {Identifier} from "../../types"
 */

/** @implements {AttributeKeyAdapter} */
export class IdentifierAttributeKeyAdapter {
  /** @param {Identifier} node */
  constructor(node) {
    this.node = node;
  }

  /** @returns {SourceLocation} */
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
