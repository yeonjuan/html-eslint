/**
 * @import {
 *   AttributeAdapter,
 *   ElementNodeAdapter
 * } from "@html-eslint/core"
 * @import {TSESTree} from "@typescript-eslint/types"
 */
const { AST_NODE_TYPES } = require("@typescript-eslint/types");
/**
 * @param {TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute} node
 * @returns {AttributeAdapter<
 *   TSESTree.JSXSpreadAttribute | TSESTree.JSXAttribute["name"] | null,
 *   TSESTree.JSXAttribute["value"]
 * >}
 */
function attributeNodeAdapter(node) {
  if (node.type === AST_NODE_TYPES.JSXSpreadAttribute) {
    return {
      key: {
        node: () => null,
        isExpression() {
          return true;
        },
        value: () => null,
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

  return {
    key: {
      node: () => node.name,
      isExpression() {
        return false;
      },
      value: () => {
        if (node.name.type === AST_NODE_TYPES.JSXIdentifier) {
          return node.name.name;
        }
        return `${node.name.namespace}:${node.name.name}`;
      },
    },
    value: {
      node: () => node.value,
      isExpression() {
        if (!node.value) {
          return false;
        }

        if (node.value && node.value.type === AST_NODE_TYPES.Literal) {
          return false;
        }

        return true;
      },
      value: () => {
        if (!node.value) {
          return "";
        }
        if (node.value.type === AST_NODE_TYPES.Literal) {
          return String(node.value.value);
        }
        return null;
      },
    },
  };
}

/**
 * @param {TSESTree.JSXOpeningElement} node
 * @returns {ElementNodeAdapter<
 *   TSESTree.JSXOpeningElement,
 *   TSESTree.JSXSpreadAttribute | TSESTree.JSXAttribute["name"] | null,
 *   TSESTree.JSXAttribute["value"]
 * >}
 */
function elementNodeAdapter(node) {
  return {
    node: () => node,
    getTagName() {
      if (node.name.type === AST_NODE_TYPES.JSXIdentifier) {
        return node.name.name;
      }
      return "";
    },
    getAttributes() {
      return node.attributes.map(attributeNodeAdapter);
    },
  };
}

module.exports = { elementNodeAdapter };
