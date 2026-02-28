/**
 * @import {
 *   AttributeAdapter,
 *   ElementNodeAdapter
 * } from "@html-eslint/core"
 * @import {
 *   JSXAttribute,
 *   JSXIdentifier,
 *   JSXOpeningElement,
 *   JSXSpreadAttribute,
 *   Literal,
 *   Node,
 *   NullLiteral,
 *   TemplateLiteral
 * } from "../../types"
 */
const { AST_NODE_TYPES } = require("../../constants/node-types");
const { findAttributeValueNode } = require("./node");

/**
 * @type {AttributeAdapter<
 *   JSXSpreadAttribute | JSXAttribute["name"] | null,
 *   Literal | TemplateLiteral | null
 * >}
 */
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
 * @param {Node} node
 * @returns {node is  NullLiteral}
 */
function isNullLiteral(node) {
  return node.type === AST_NODE_TYPES.Literal && node.value == null;
}

/**
 * @param {Node} node
 * @returns {string | null}
 */
function getAttributeValue(node) {
  switch (node.type) {
    case AST_NODE_TYPES.Literal:
      if (node.value === null) {
        if (isNullLiteral(node)) {
          return null;
        }
        if ("regex" in node) {
          // @ts-ignore
          return `/${node.regex.pattern}/${node.regex.flags}`;
        }

        if ("bigint" in node) {
          // @ts-ignore
          return node.bigint;
        }
      } else {
        if (node.value === true) {
          return "";
        }
        if (node.value === false || node.value === undefined) {
          return null;
        }
        return String(node.value);
      }
      break;

    case AST_NODE_TYPES.TemplateLiteral:
      if (node.expressions.length === 0 && node.quasis.length === 1) {
        return node.quasis[0].value.cooked;
      }
      break;
    case AST_NODE_TYPES.JSXExpressionContainer: {
      // @ts-ignore
      return getAttributeValue(node.expression);
    }
  }
  return null;
}

/**
 * @param {JSXAttribute | JSXSpreadAttribute} node
 * @returns {AttributeAdapter<
 *   JSXSpreadAttribute | JSXAttribute["name"] | null,
 *   Literal | TemplateLiteral | JSXIdentifier | null
 * >}
 */
function attributeNodeAdapter(node) {
  if (node.type === AST_NODE_TYPES.JSXSpreadAttribute) {
    return nullAdapter;
  }

  return {
    key: {
      node: () => node.name,
      isExpression() {
        return false;
      },
      value: () => {
        if (node.name.type === AST_NODE_TYPES.JSXIdentifier) {
          return node.name.name.toLowerCase();
        }
        return `${node.name.namespace}:${node.name.name}`;
      },
      raw: () => {
        if (node.name.type === AST_NODE_TYPES.JSXIdentifier) {
          return node.name.name;
        }
        return `${node.name.namespace}:${node.name.name}`;
      },
    },
    value: {
      node: () => {
        return findAttributeValueNode(node);
      },
      isExpression() {
        if (!node.value) {
          return false;
        }
        return !findAttributeValueNode(node);
      },
      value: () => {
        if (!node.value) {
          return "";
        }

        return getAttributeValue(node.value);
      },
    },
  };
}

/**
 * @param {JSXOpeningElement} node
 * @returns {ElementNodeAdapter<
 *   JSXOpeningElement,
 *   JSXSpreadAttribute | JSXAttribute["name"] | null,
 *   Literal | TemplateLiteral | JSXIdentifier | null
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

module.exports = { elementNodeAdapter, attributeNodeAdapter };
