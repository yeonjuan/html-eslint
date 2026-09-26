/**
 * @import {ElementAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {AngularElement} from "../../types"
 */

const { AST_NODE_TYPES } = require("../../constants/node-types");
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

  getLocation() {
    return /** @type {SourceLocation} */ (this.node.loc);
  }

  getRange() {
    return /** @type {Range} */ (this.node.range);
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
    const attributes = this.node.attributes.map((attribute) =>
      createAttributeAdapter(attribute)
    );
    const inputs = this.node.inputs.map((input) =>
      createAttributeAdapter(input)
    );
    return [...attributes, ...inputs];
  }

  /** @returns {{ name: string; isCustomElement: boolean } | null} */
  getParentContainer() {
    /** @type {any} */
    let current = this.node.parent;
    while (current && current.type !== AST_NODE_TYPES.Element) {
      current = current.parent;
    }
    if (!current) {
      // No enclosing element - e.g. this is the root of a template meant
      // to be projected into a list elsewhere (e.g. via `<ng-content>`).
      return { name: "", isCustomElement: true };
    }
    if (current.name.includes("-")) {
      // Angular components/directives (by convention) and built-in
      // elements like <ng-container>/<ng-template> whose rendered output
      // can't be statically verified.
      return { name: "", isCustomElement: true };
    }
    return { name: current.name, isCustomElement: false };
  }
}

module.exports = {
  AngularElementElementAdapter,
};
