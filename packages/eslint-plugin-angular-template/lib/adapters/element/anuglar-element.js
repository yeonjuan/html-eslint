/**
 * @import {ElementAdapter} from "@html-eslint/core"
 * @import {Range} from "@html-eslint/types"
 * @import {AngularElement} from "../../types"
 */

const { createAttributeAdapter } = require("../attribute/factory");

/** @implements {ElementAdapter} */
class AngularElementElementAdapter {
  /** @param {AngularElement} node */
  constructor(node) {
    this.node = node;
  }

  getElementName() {
    return this.node.name;
  }

  getOpenStartLocation() {
    // eslint-disable-next-line prefer-destructuring
    const loc = /** @type {import("@html-eslint/types").SourceLocation} */ (
      this.node.loc
    );
    return {
      start: {
        line: loc.start.line,
        column: loc.start.column,
      },
      end: {
        line: loc.start.line,
        column: loc.start.column + this.node.name.length + 1,
      },
    };
  }

  getOpenStartRange() {
    // eslint-disable-next-line prefer-destructuring
    const range = /** @type {Range} */ (this.node.range);
    return /** @type {Range} */ ([
      range[0],
      range[0] + this.node.name.length + 1,
    ]);
  }

  getAttributes() {
    return this.node.attributes.map((attribute) =>
      createAttributeAdapter(attribute)
    );
  }
}

module.exports = {
  AngularElementElementAdapter,
};
