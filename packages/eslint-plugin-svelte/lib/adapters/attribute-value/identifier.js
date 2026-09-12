/**
 * @import {AttributeValueAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {Identifier} from "../../types"
 */

/**
 * Adapter for the value of a shorthand attribute (`{alt}`), which is always a
 * dynamic expression.
 *
 * @implements {AttributeValueAdapter}
 */
export class IdentifierAttributeValueAdapter {
  /** @param {Identifier} node */
  constructor(node) {
    this.node = node;
  }

  /** @returns {SourceLocation} */
  getLocation() {
    return this.node.loc;
  }

  /** @returns {Range} */
  getRange() {
    return /** @type {Range} */ (this.node.range);
  }

  hasExpression() {
    return true;
  }

  getValue() {
    return null;
  }

  getBooleanValue() {
    return null;
  }
}
