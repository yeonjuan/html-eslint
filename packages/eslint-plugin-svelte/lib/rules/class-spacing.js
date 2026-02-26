/**
 * @import {ClassSpacingResult} from "@html-eslint/core"
 * @import {
 *   NodeOrToken,
 *   RuleModule,
 *   SvelteLiteral
 * } from "../types.js"
 * @file Disallow extra spacing in class attribute values for Svelte
 */

import { CLASS_SPACING_MESSAGE_IDS, classSpacing } from "@html-eslint/core";
import { AST_NODE_TYPES } from "../constants/node-types.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "layout",
    docs: {
      description: "Disallow extra spacing in class attribute values",
      recommended: true,
      category: "Stylistic Issues",
      url: "https://html-eslint.org/docs/svelte/rules/class-spacing",
    },
    fixable: "code",
    schema: [],
    messages: {
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingStart]:
        "Unexpected space at the start of class attribute value",
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingEnd]:
        "Unexpected space at the end of class attribute value",
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingBetween]:
        "Unexpected extra spaces between class names",
    },
  },

  create(context) {
    const ruleCore = classSpacing();

    /**
     * Calculate location based on spacing type and result
     *
     * @param {NodeOrToken} node
     * @param {ClassSpacingResult<any>[number]} result
     * @returns {import("eslint").AST.SourceLocation}
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
     * Check if a node is a static string (Literal or simple TemplateLiteral)
     *
     * @param {any} node
     * @returns {boolean}
     */
    function isStaticString(node) {
      if (
        node.type === AST_NODE_TYPES.Literal &&
        typeof node.value === "string"
      ) {
        return true;
      }
      if (
        node.type === AST_NODE_TYPES.TemplateLiteral &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
      ) {
        return true;
      }
      return false;
    }

    /**
     * Process a string node and check for spacing issues
     *
     * @param {any} node
     */
    function processStringNode(node) {
      if (!isStaticString(node)) {
        return;
      }

      let value = null;
      if (node.type === "Literal" && typeof node.value === "string") {
        value = node.value;
      } else if (
        node.type === "TemplateLiteral" &&
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
          value: () => "class",
          raw: () => "class",
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
     * Process SvelteLiteral node
     *
     * @param {SvelteLiteral} valuePart
     * @param {boolean} hasNextPart - Whether there are more value parts after
     *   this one
     */
    function processSvelteLiteral(valuePart, hasNextPart) {
      const value = valuePart.value;
      if (!value || typeof value !== "string") {
        return;
      }

      const adapter = {
        key: {
          node: () => null,
          isExpression: () => false,
          value: () => "class",
          raw: () => "class",
        },
        value: {
          node: () => valuePart,
          isExpression: () => false,
          value: () => value,
        },
      };

      const results = ruleCore.checkClassAttribute(adapter);
      for (const result of results) {
        // Skip trailing space errors if there are more value parts after this
        if (hasNextPart && result.spacingType === "end") {
          continue;
        }

        const normalizedValue = result.data.normalized;
        const loc = calculateLocation(valuePart, result);

        context.report({
          node: valuePart,
          loc,
          messageId: result.messageId,
          fix(fixer) {
            return fixer.replaceTextRange(valuePart.range, normalizedValue);
          },
        });
      }
    }

    return {
      SvelteAttribute(node) {
        if (
          !node.key ||
          !node.key.name ||
          node.key.name.toLowerCase() !== "class"
        ) {
          return;
        }

        if (!node.value || node.value.length === 0) {
          return;
        }

        node.value.forEach((valuePart, index) => {
          const hasNextPart = index < node.value.length - 1;

          if (valuePart.type === AST_NODE_TYPES.SvelteLiteral) {
            processSvelteLiteral(valuePart, hasNextPart);
          } else if (valuePart.type === AST_NODE_TYPES.SvelteMustacheTag) {
            const expression = valuePart.expression;
            if (
              expression &&
              expression.type === AST_NODE_TYPES.ArrayExpression
            ) {
              expression.elements.forEach((element) => {
                if (element && isStaticString(element)) {
                  processStringNode(element);
                }
              });
            } else if (expression && isStaticString(expression)) {
              processStringNode(expression);
            }
          }
        });
      },
    };
  },
};

export default rule;
