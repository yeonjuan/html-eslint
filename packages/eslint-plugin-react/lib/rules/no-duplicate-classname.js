/**
 * @import {NoDuplicateClassResult} from "@html-eslint/core"
 * @import {AST} from "eslint"
 * @import {
 *   Literal,
 *   Node,
 *   NodeOrToken,
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
     * Calculate location based on duplicate class result
     *
     * @param {NodeOrToken} node
     * @param {NoDuplicateClassResult<any>[number]} result
     * @returns {AST.SourceLocation}
     */
    function calculateLocation(node, result) {
      // For Literal nodes, we need to account for the opening quote
      const offset = node.type === AST_NODE_TYPES.Literal ? 1 : 0;
      return {
        start: {
          line: node.loc.start.line,
          column: node.loc.start.column + result.classIndex + offset,
        },
        end: {
          line: node.loc.start.line,
          column:
            node.loc.start.column +
            result.classIndex +
            result.className.length +
            offset,
        },
      };
    }

    /**
     * @param {Node} node
     * @returns {node is Literal | TemplateLiteral}
     */
    function isStaticString(node) {
      return (
        node.type === AST_NODE_TYPES.Literal ||
        (node.type === AST_NODE_TYPES.TemplateLiteral &&
          node.expressions.length === 0 &&
          node.quasis.length === 1)
      );
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
      if (node.type === AST_NODE_TYPES.Literal && typeof node.value === "string") {
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
     * Create a fixed string by removing duplicate class
     *
     * @param {string} originalValue
     * @param {NoDuplicateClassResult<any>[number]} result
     * @returns {string}
     */
    function createFixedValue(originalValue, result) {
      const startIndex = result.hasSpacesBefore
        ? result.spacesBeforePos
        : result.classIndex;
      const endIndex = result.hasSpacesAfter
        ? result.classIndex + result.classLength + result.spacesAfterLength
        : result.classIndex + result.classLength;

      const replacement =
        result.hasClassBefore && result.hasClassAfter ? " " : "";

      return (
        originalValue.substring(0, startIndex) +
        replacement +
        originalValue.substring(endIndex)
      );
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
            const fixedValue = createFixedValue(value, result);
            if (node.type === AST_NODE_TYPES.Literal) {
              return fixer.replaceText(node, `"${fixedValue}"`);
            } else if (node.type === AST_NODE_TYPES.TemplateLiteral) {
              return fixer.replaceText(node, `\`${fixedValue}\``);
            }
            return null;
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

        // Check all arguments
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
          // For JSXAttribute, we need to handle the different node types
          let targetNode = attrValueNode;
          let value = attrValue;

          // If it's a JSXExpressionContainer, we need to work with the expression inside
          if (attrValueNode.type === AST_NODE_TYPES.JSXExpressionContainer) {
            const expression = attrValueNode.expression;
            if (isStaticString(expression)) {
              targetNode = expression;
              value = getRawValue(expression) || attrValue;
            } else {
              continue;
            }
          } else if (!isStaticString(attrValueNode)) {
            continue;
          }

          const loc = calculateLocation(targetNode, result);

          context.report({
            node: result.node,
            loc,
            messageId: result.messageId,
            data: result.data,
            fix(fixer) {
              const fixedValue = createFixedValue(value, result);
              if (targetNode.type === AST_NODE_TYPES.Literal) {
                return fixer.replaceText(targetNode, `"${fixedValue}"`);
              } else if (targetNode.type === AST_NODE_TYPES.TemplateLiteral) {
                return fixer.replaceText(targetNode, `\`${fixedValue}\``);
              }
              return null;
            },
          });
        }
      },
    };
  },
};
