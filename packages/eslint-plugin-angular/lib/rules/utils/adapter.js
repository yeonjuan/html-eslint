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

/** @type {AttributeAdapter<null, null>} */
const nullAdapter = {
  key: {
    node: () => null,
    isExpression() {
      return true;
    },
    value: () => null,
    raw: () => null,
  },
  value: {
    node: () => null,
    isExpression() {
      return true;
    },
    value: () => null,
  },
};

/**
 * @param {AngularTextAttribute} node
 * @returns {AttributeAdapter<AngularTextAttribute | null, null>}
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
      node: () => null,
      isExpression() {
        return false;
      },
      value: () => node.value,
    },
  };
}

/**
 * BoundAttribute is a dynamic binding like [attr]="expr". We treat it as an
 * expression so baseline checks skip value validation.
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
