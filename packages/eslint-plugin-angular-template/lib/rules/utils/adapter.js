/**
 * @import {
 *   AttributeAdapter,
 *   ElementNodeAdapter
 * } from "@html-eslint/core"
 * @import {
 *   AngularBoundAttribute,
 *   AngularElement,
 *   AngularTextAttribute
 * } from "../../types"
 */
const { AST_NODE_TYPES } = require("../../constants/node-types");

/**
 * @param {AngularTextAttribute} node
 * @returns {AttributeAdapter<
 *   AngularTextAttribute | null,
 *   AngularTextAttribute
 * >}
 */
function textAttributeAdapter(node) {
  return {
    key: {
      node: () => node,
      isExpression() {
        return false;
      },
      value: () => node.name.toLowerCase(),
      raw: () => node.name,
    },
    value: {
      node: () => node,
      isExpression() {
        return false;
      },
      value: () => node.value,
    },
  };
}

/**
 * BoundAttribute covers two Angular binding syntaxes:
 *
 * - Property binding: `[property]="expr"` (BindingType.Property = 0) node.name
 *   holds the property name as-is (e.g. "disabled", "href")
 * - Attribute binding: `[attr.attr-key]="expr"` (BindingType.Attribute = 1)
 *   Angular strips the "attr." prefix, so node.name already holds the bare
 *   attribute name (e.g. "aria-label", "data-id")
 *
 * In both cases the value is a dynamic expression, so value.isExpression()
 * returns true to skip value validation in baseline checks.
 *
 * @param {AngularBoundAttribute} node
 * @returns {AttributeAdapter<AngularBoundAttribute | null, null>}
 */
function boundAttributeAdapter(node) {
  return {
    key: {
      node: () => node,
      isExpression() {
        return false;
      },
      value: () => node.name.toLowerCase(),
      raw: () => node.name,
    },
    value: {
      node: () => null,
      isExpression() {
        // Both property binding ([prop]="expr") and attribute binding
        // ([attr.key]="expr") have dynamic values — always treat as expression.
        return true;
      },
      value: () => null,
    },
  };
}

/**
 * @param {AngularElement} node
 * @returns {ElementNodeAdapter<
 *   AngularElement,
 *   AngularTextAttribute | AngularBoundAttribute | null,
 *   null
 * >}
 */
function elementNodeAdapter(node) {
  return {
    node: () => node,
    getTagName() {
      return node.name;
    },
    getAttributes() {
      /** @type {AttributeAdapter<any, any>[]} */
      const adapters = [];

      for (const attr of node.attributes) {
        if (attr.type === AST_NODE_TYPES.TextAttribute) {
          adapters.push(textAttributeAdapter(attr));
        }
      }

      for (const input of node.inputs) {
        if (input.type === AST_NODE_TYPES.BoundAttribute) {
          adapters.push(boundAttributeAdapter(input));
        }
      }

      return adapters;
    },
  };
}

module.exports = {
  elementNodeAdapter,
  textAttributeAdapter,
  boundAttributeAdapter,
};
