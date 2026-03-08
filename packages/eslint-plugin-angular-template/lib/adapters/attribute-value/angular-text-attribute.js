/**
 * @import {AttributeValueAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {AngularTextAttribute} from "../../types"
 */

/** @implements {AttributeValueAdapter} */
class AngularTextAttributeAttributeValueAdapter {
  /** @param {AngularTextAttribute} node */
  constructor(node) {
    this.node = node;
  }

  getLocation() {
    return /** @type {SourceLocation} */ ({
      start: {
        // @ts-ignore
        line: this.node.valueSpan?.start.line + 1,
        column: this.node.valueSpan?.start.col,
      },
      end: {
        // @ts-ignore
        line: this.node.valueSpan?.end.line + 1,
        column: this.node.valueSpan?.end.col,
      },
    });
  }

  getRange() {
    return /** @type {Range} */ ([
      this.node.valueSpan?.fullStart?.offset,
      this.node.valueSpan?.end.offset,
    ]);
  }

  hasExpression() {
    return false;
  }

  getValue() {
    return this.node.value;
  }
}

module.exports = {
  AngularTextAttributeAttributeValueAdapter,
};
