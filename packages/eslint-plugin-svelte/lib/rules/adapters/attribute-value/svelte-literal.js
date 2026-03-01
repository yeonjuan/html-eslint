/**
 * @import {AttributeValueAdapter} from "@html-eslint/core"
 * @import {SvelteLiteral} from "../../../types"
 */

/** @implements {AttributeValueAdapter} */
export class SvelteLiteralAttributeValueAdapter {
  /** @param {SvelteLiteral} node */
  constructor(node) {
    this.node = node;
  }

  getLocation() {
    return this.node.loc;
  }

  getRange() {
    return this.node.range;
  }

  getValue() {
    return this.node.value;
  }

  hasExpression() {
    return false;
  }
}
