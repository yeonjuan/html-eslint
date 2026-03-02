/**
 * @import {
 *   AttributeAdapter,
 *   ElementAdapter
 * } from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {JSXElement} from "../../types"
 */

const { AST_NODE_TYPES } = require("../../constants/node-types");
const { createAttributeAdapter } = require("../attribute/factory");

/** @implements {ElementAdapter} */
class JSXElementElementAdapter {
  /** @param {JSXElement} node */
  constructor(node) {
    this.node = node;
  }

  /** @returns {string} */
  getElementName() {
    if (
      this.node.openingElement.name.type === AST_NODE_TYPES.JSXNamespacedName
    ) {
      return `${this.node.openingElement.name.namespace.name}:${this.node.openingElement.name.name.name}`;
    }
    if (
      this.node.openingElement.name.type === AST_NODE_TYPES.JSXMemberExpression
    ) {
      // TODO: JSXMemberExpression 처리 (ex: <a.a ===> "a.a")
      return "";
    }
    return this.node.openingElement.name.name;
  }

  /** @returns {AttributeAdapter[]} */
  getAttributes() {
    return this.node.openingElement.attributes.map((attribute) =>
      createAttributeAdapter(attribute)
    );
  }

  /** @returns {SourceLocation} */
  getOpenStartLocation() {
    return this.node.openingElement.name.loc;
  }

  /** @returns {Range} */
  getOpenStartRange() {
    return this.node.openingElement.name.range;
  }
}

module.exports = { JSXElementElementAdapter };
