/**
 * @import {ClassSpacingResult} from "@html-eslint/core"
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
  classSpacing,
  CLASS_SPACING_MESSAGE_IDS,
} = require("@html-eslint/core");
const { attributeNodeAdapter } = require("./utils/adapter");
const { AST_NODE_TYPES } = require("../constants/node-types");

/** @type {RuleModule<[Option]>} */
module.exports = {
  meta: {
    type: "layout",

    docs: {
      description: "Disallow extra spacing in className values",
      category: "Stylistic Issues",
      recommended: false,
      url: "https://html-eslint.org/docs/react/rules/classname-spacing",
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
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingStart]:
        "Unexpected space at the start of className value",
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingEnd]:
        "Unexpected space at the end of className value",
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingBetween]:
        "Unexpected extra spaces between class names",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const callees = options.callees || [];
    const ruleCore = classSpacing();

    /**
     * Calculate location based on spacing type and result
     *
     * @param {NodeOrToken} node
     * @param {ClassSpacingResult<any>[number]} result
     * @returns {AST.SourceLocation}
     */
    function calculateLocation(node, result) {
      if (result.spacingType === "start") {
        return {
          start: node.loc.start,
          end: {
            line: node.loc.start.line,
            column: node.loc.start.column + result.spacingLength,
          },
        };
      } else if (result.spacingType === "end") {
        return {
          start: {
            line: node.loc.end.line,
            column: node.loc.end.column - result.spacingLength,
          },
          end: node.loc.end,
        };
      } else {
        return {
          start: {
            line: node.loc.start.line,
            column: node.loc.start.column + result.spacingIndex,
          },
          end: {
            line: node.loc.start.line,
            column:
              node.loc.start.column +
              result.spacingIndex +
              result.spacingLength,
          },
        };
      }
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
     * Process a string node and check for spacing issues
     *
     * @param {Node} node
     */
    function processStringNode(node) {
      if (!isStaticString(node)) {
        return;
      }

      let value = null;
      if (
        node.type === AST_NODE_TYPES.Literal &&
        typeof node.value === "string"
      ) {
        value = node.value;
      } else if (
        node.type === AST_NODE_TYPES.TemplateLiteral &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
      ) {
        value = node.quasis[0].value.cooked;
      }

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
        const normalizedValue = result.data.normalized;
        const loc = calculateLocation(node, result);

        context.report({
          node,
          loc,
          messageId: result.messageId,
          fix(fixer) {
            if (node.type === AST_NODE_TYPES.Literal) {
              return fixer.replaceText(node, `"${normalizedValue}"`);
            } else if (node.type === AST_NODE_TYPES.TemplateLiteral) {
              return fixer.replaceText(node, `\`${normalizedValue}\``);
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
        if (!attrValueNode) {
          return;
        }
        const results = ruleCore.checkClassAttribute(adapter);
        for (const result of results) {
          if (!attrValue) {
            continue;
          }
          const normalizedValue = result.data.normalized;
          const loc = calculateLocation(attrValueNode, result);

          context.report({
            node: result.node,
            loc,
            messageId: result.messageId,
            fix(fixer) {
              if (attrValueNode.type === AST_NODE_TYPES.Literal) {
                return fixer.replaceText(attrValueNode, `"${normalizedValue}"`);
              } else if (
                attrValueNode.type === AST_NODE_TYPES.JSXExpressionContainer
              ) {
                const expression = attrValueNode.expression;
                if (expression.type === AST_NODE_TYPES.Literal) {
                  return fixer.replaceText(expression, `"${normalizedValue}"`);
                } else if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
                  return fixer.replaceText(
                    expression,
                    `\`${normalizedValue}\``
                  );
                }
              }
              return null;
            },
          });
        }
      },
    };
  },
};
