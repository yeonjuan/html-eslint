/**
 * @import {AttributeValueAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {SvelteLiteral} from "../../types"
 */

/** @implements {AttributeValueAdapter} */
export class SvelteLiteralAttributeValueAdapter {
  /** @param {SvelteLiteral} node */
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

  hasExpression() {
    return false;
  }

  getValue() {
    if (typeof this.node.value === "string") {
      return this.node.value;
    } else if (typeof this.node.value === "number") {
      return String(this.node.value);
    }
    return null;
  }
}
