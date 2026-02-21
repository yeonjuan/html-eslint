/**
 * @import {NoDuplicateClassResult} from "@html-eslint/core"
 * @import {AST} from "eslint"
 * @import {
 *   Literal,
 *   Node,
 *   RuleModule,
 *   TemplateLiteral
 * } from "../types"
 * @typedef {Object} Option
 * @property {string[]} [Option.callees]
 */
const {
  noDuplicateClass,
  NO_DUPLICATE_CLASS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { attributeNodeAdapter } = require("./utils/adapter");
const { AST_NODE_TYPES } = require("../constants/node-types");
const { isStaticString } = require("./utils/node");

/** @type {RuleModule<[Option]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow duplicate class names in className",
      category: "Best Practices",
      recommended: true,
      url: "https://html-eslint.org/docs/react/rules/no-duplicate-classname",
    },

    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          callees: {
            type: "array",
            items: {
              type: "string",
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [NO_DUPLICATE_CLASS_MESSAGE_IDS.duplicateClass]:
        "The class '{{class}}' is duplicated.",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const callees = options.callees || [];
    const ruleCore = noDuplicateClass();

    /**
     * Get the actual string content node from attribute value Unwraps
     * JSXExpressionContainer if needed
     *
     * @param {any} valueNode
     * @returns {any}
     */
    function getStringContentNode(valueNode) {
      if (valueNode.type === AST_NODE_TYPES.JSXExpressionContainer) {
        return valueNode.expression;
      }
      return valueNode;
    }

    /**
     * Calculate offset for the string content based on node type
     *
     * - Literal: 1 (opening quote)
     * - TemplateLiteral: 1 (opening backtick)
     *
     * @param {any} contentNode
     * @returns {number}
     */
    function getStringContentOffset(contentNode) {
      if (
        contentNode.type === AST_NODE_TYPES.Literal ||
        contentNode.type === AST_NODE_TYPES.TemplateLiteral
      ) {
        return 1;
      }
      return 0;
    }

    /**
     * Calculate location based on duplicate class result
     *
     * @param {any} valueNode - The attribute value node (may be
     *   JSXExpressionContainer)
     * @param {NoDuplicateClassResult<any>[number]} result
     * @returns {AST.SourceLocation}
     */
    function calculateLocation(valueNode, result) {
      const contentNode = getStringContentNode(valueNode);
      const offset = getStringContentOffset(contentNode);

      return {
        start: {
          line: contentNode.loc.start.line,
          column: contentNode.loc.start.column + result.classIndex + offset,
        },
        end: {
          line: contentNode.loc.start.line,
          column:
            contentNode.loc.start.column +
            result.classIndex +
            result.className.length +
            offset,
        },
      };
    }

    /**
     * Check if a node matches the callees option
     *
     * @param {any} node
     * @returns {boolean}
     */
    function isTargetCallee(node) {
      if (node.callee.type === AST_NODE_TYPES.Identifier) {
        return callees.includes(node.callee.name);
      }

      return false;
    }

    /**
     * Get the raw text value from a node
     *
     * @param {Node} node
     * @returns {string | null}
     */
    function getRawValue(node) {
      if (
        node.type === AST_NODE_TYPES.Literal &&
        typeof node.value === "string"
      ) {
        return node.value;
      } else if (
        node.type === AST_NODE_TYPES.TemplateLiteral &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
      ) {
        return node.quasis[0].value.cooked;
      }
      return null;
    }

    /**
     * Process a string node and check for duplicate classes
     *
     * @param {Node} node
     */
    function processStringNode(node) {
      if (!isStaticString(node)) {
        return;
      }

      const value = getRawValue(node);
      if (!value) {
        return;
      }

      const adapter = {
        key: {
          node: () => null,
          isExpression: () => false,
          value: () => "classname",
          raw: () => "classname",
        },
        value: {
          node: () => node,
          isExpression: () => false,
          value: () => value,
        },
      };

      const results = ruleCore.checkClassAttribute(adapter);
      for (const result of results) {
        const loc = calculateLocation(node, result);

        context.report({
          node,
          loc,
          messageId: result.messageId,
          data: result.data,
          fix(fixer) {
            // Get the offset based on node type
            const offset = getStringContentOffset(node);

            const startRange = result.hasSpacesBefore
              ? node.range[0] + offset + result.spacesBeforePos
              : node.range[0] + offset + result.classIndex;

            const endRange = result.hasSpacesAfter
              ? node.range[0] +
                offset +
                result.classIndex +
                result.classLength +
                result.spacesAfterLength
              : node.range[0] + offset + result.classIndex + result.classLength;

            return fixer.replaceTextRange(
              [startRange, endRange],
              result.hasClassBefore && result.hasClassAfter ? " " : ""
            );
          },
        });
      }
    }

    /**
     * Recursively process a node to find and check string literals
     *
     * @param {any} node
     */
    function processNode(node) {
      if (isStaticString(node)) {
        processStringNode(node);
      } else if (node.type === AST_NODE_TYPES.LogicalExpression) {
        processNode(node.left);
        processNode(node.right);
      } else if (node.type === AST_NODE_TYPES.ConditionalExpression) {
        processNode(node.consequent);
        processNode(node.alternate);
      }
    }

    return {
      CallExpression(node) {
        if (!isTargetCallee(node)) {
          return;
        }

        for (const arg of node.arguments) {
          processNode(arg);
        }
      },
      JSXAttribute(node) {
        const adapter = attributeNodeAdapter(node);
        if (adapter.key.value() !== "classname") {
          return;
        }
        const attrValue = adapter.value.value();
        const attrValueNode = adapter.value.node();
        if (!attrValueNode || !attrValue) {
          return;
        }

        const results = ruleCore.checkClassAttribute(adapter);
        for (const result of results) {
          const loc = calculateLocation(attrValueNode, result);

          context.report({
            node: result.node,
            loc,
            messageId: result.messageId,
            data: result.data,
            fix(fixer) {
              // Get the actual string content node and its offset
              const contentNode = getStringContentNode(attrValueNode);
              const offset = getStringContentOffset(contentNode);

              const startRange = result.hasSpacesBefore
                ? contentNode.range[0] + offset + result.spacesBeforePos
                : contentNode.range[0] + offset + result.classIndex;

              const endRange = result.hasSpacesAfter
                ? contentNode.range[0] +
                  offset +
                  result.classIndex +
                  result.classLength +
                  result.spacesAfterLength
                : contentNode.range[0] +
                  offset +
                  result.classIndex +
                  result.classLength;

              return fixer.replaceTextRange(
                [startRange, endRange],
                result.hasClassBefore && result.hasClassAfter ? " " : ""
              );
            },
          });
        }
      },
    };
  },
};
