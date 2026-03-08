/**
 * @import {AttributeKeyAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {AngularBoundAttribute} from "../../types"
 */

/** @implements {AttributeKeyAdapter} */
class AngularBoundAttributeAttributeKeyAdapter {
  /** @param {AngularBoundAttribute} node */
  constructor(node) {
    this.node = node;
  }

  getLocation() {
    return /** @type {SourceLocation} */ ({
      start: {
        // @ts-ignore
        line: this.node.keySpan?.start.line + 1,
        column: this.node.keySpan?.start.col,
      },
      end: {
        // @ts-ignore
        line: this.node.keySpan?.end.line + 1,
        column: this.node.keySpan?.end.col,
      },
    });
  }

  getRange() {
    return /** @type {Range} */ ([
      this.node.keySpan?.fullStart?.offset,
      this.node.keySpan?.end.offset,
    ]);
  }

  hasExpression() {
    return true;
  }

  getValue() {
    return this.node.name;
  }
}

module.exports = {
  AngularBoundAttributeAttributeKeyAdapter,
};
