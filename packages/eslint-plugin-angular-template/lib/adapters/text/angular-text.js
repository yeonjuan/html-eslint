/**
 * @import {TextAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {AngularText} from "../../types"
 */

/** @implements {TextAdapter} */
class AngularTextAdapter {
  /** @param {AngularText} node */
  constructor(node) {
    this.node = node;
  }

  getValue() {
    return this.node.value;
  }

  getRange() {
    return /** @type {Range} */ ([
      this.node.sourceSpan?.fullStart?.offset,
      this.node.sourceSpan?.end.offset,
    ]);
  }

  getLocation() {
    return /** @type {SourceLocation} */ ({
      start: {
        // @ts-ignore
        line: this.node.sourceSpan?.start.line + 1,
        column: this.node.sourceSpan?.start.col,
      },
      end: {
        // @ts-ignore
        line: this.node.sourceSpan?.end.line + 1,
        column: this.node.sourceSpan?.end.col,
      },
    });
  }
}

module.exports = {
  AngularTextAdapter,
};
