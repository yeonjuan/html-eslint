/**
 * @import {
 *   AttributeAdapter,
 *   ElementNodeAdapter
 * } from "@html-eslint/core"
 * @import {TSESTree} from "@typescript-eslint/types"
 */
const { AST_NODE_TYPES } = require("@typescript-eslint/types");

/**
 * @type {AttributeAdapter<
 *   TSESTree.JSXSpreadAttribute | TSESTree.JSXAttribute["name"] | null,
 *   TSESTree.JSXAttribute["value"]
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
 * @param {TSESTree.Node} node
 * @returns {node is  TSESTree.NullLiteral}
 */
function isNullLiteral(node) {
  return node.type === AST_NODE_TYPES.Literal && node.value == null;
}

/**
 * @param {TSESTree.Node} node
 * @returns {string | null}
 */
function getAttributeValue(node) {
  switch (node.type) {
    case AST_NODE_TYPES.Literal:
      if (node.value === null) {
        if (isNullLiteral(node)) {
          return String(node.value); // "null"
        }
        if ("regex" in node) {
          return `/${node.regex.pattern}/${node.regex.flags}`;
        }

        if ("bigint" in node) {
          return node.bigint;
        }
      } else {
        return String(node.value);
      }
      break;

    case AST_NODE_TYPES.TemplateLiteral:
      if (node.expressions.length === 0 && node.quasis.length === 1) {
        return node.quasis[0].value.cooked;
      }
      break;
    case AST_NODE_TYPES.JSXExpressionContainer: {
      return getAttributeValue(node.expression);
    }
  }
  return null;
}

/**
 * @param {TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute} node
 * @returns {AttributeAdapter<
 *   TSESTree.JSXSpreadAttribute | TSESTree.JSXAttribute["name"] | null,
 *   TSESTree.JSXAttribute["value"]
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
      node: () => node.value,
      isExpression() {
        if (!node.value) {
          return false;
        }

        if (node.value.type === AST_NODE_TYPES.Literal) {
          return false;
        }

        if (
          node.value.type === AST_NODE_TYPES.JSXExpressionContainer &&
          (node.value.expression.type === AST_NODE_TYPES.Literal ||
            (node.value.expression.type === AST_NODE_TYPES.TemplateLiteral &&
              node.value.expression.expressions.length === 0 &&
              node.value.expression.quasis.length === 1))
        ) {
          return false;
        }

        return true;
      },
      value: () => {
        if (!node.value) {
          return "";
        }
        if (
          node.value.type === AST_NODE_TYPES.JSXExpressionContainer &&
          node.value.expression.type === AST_NODE_TYPES.Literal &&
          (typeof node.value.expression.value === "boolean" ||
            typeof node.value.expression.value === "undefined" ||
            (typeof node.value.expression.value === "object" &&
              !node.value.expression.value))
        ) {
          return null;
        }
        return getAttributeValue(node.value);
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
