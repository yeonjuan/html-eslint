/**
 * @import {AttributeAdapter} from "@html-eslint/core"
 * @import {SourceLocation} from "@html-eslint/types"
 * @import {AngularTextAttribute} from "../../types"
 */

const {
  AngularTextAttributeAttributeKeyAdapter,
} = require("../attribute-key/angular-text-attribute");
const {
  AngularTextAttributeAttributeValueAdapter,
} = require("../attribute-value/angular-text-attribute");

/** @implements {AttributeAdapter} */
class AngularTextAttributeAttributeAdapter {
  /** @param {AngularTextAttribute} node */
  constructor(node) {
    this.node = node;
  }
  getKey() {
    return new AngularTextAttributeAttributeKeyAdapter(this.node);
  }

  getValue() {
    return new AngularTextAttributeAttributeValueAdapter(this.node);
  }

  /** @returns {SourceLocation} */
  getLocation() {
    return /** @type {SourceLocation} */ ({
      start: {
        // @ts-ignore
        line: this.node.sourceSpan.start.line + 1,
        // @ts-ignore
        column: this.node.sourceSpan.start.col,
      },
      end: {
        // @ts-ignore
        line: this.node.sourceSpan.end.line + 1,
        // @ts-ignore
        column: this.node.sourceSpan.end.col,
      },
    });
  }
}

module.exports = {
  AngularTextAttributeAttributeAdapter,
};
