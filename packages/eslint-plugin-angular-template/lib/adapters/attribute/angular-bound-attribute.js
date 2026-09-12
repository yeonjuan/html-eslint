/**
 * @import {AttributeAdapter} from "@html-eslint/core"
 * @import {SourceLocation} from "@html-eslint/types"
 * @import {AngularBoundAttribute} from "../../types"
 */

const {
  AngularBoundAttributeAttributeKeyAdapter,
} = require("../attribute-key/angular-bound-attribute");
const {
  AngularBoundAttributeAttributeValueAdapter,
} = require("../attribute-value/angular-bound-attribute");

/** @implements {AttributeAdapter} */
class AngularBoundAttributeAttributeAdapter {
  /** @param {AngularBoundAttribute} node */
  constructor(node) {
    this.node = node;
  }
  getKey() {
    return new AngularBoundAttributeAttributeKeyAdapter(this.node);
  }

  getValue() {
    return new AngularBoundAttributeAttributeValueAdapter(this.node);
  }

  isSpread() {
    return false;
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
  AngularBoundAttributeAttributeAdapter,
};
