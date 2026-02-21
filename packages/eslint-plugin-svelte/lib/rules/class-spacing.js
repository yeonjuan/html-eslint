/**
 * @file Disallow extra spacing in class attribute values for Svelte
 * @typedef {import("../types.js").RuleModule} RuleModule
 */

import { classSpacing, CLASS_SPACING_MESSAGE_IDS } from "@html-eslint/core";
import { attributeNodeAdapter } from "./utils/adapter.js";

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

    return {
      /**
       * @param {any} node
       * @returns
       */
      SvelteAttribute(node) {
        // Check if this is a class attribute
        if (
          !node.key ||
          !node.key.name ||
          node.key.name.toLowerCase() !== "class"
        ) {
          return;
        }

        // Skip if no value
        if (!node.value || node.value.length === 0) {
          return;
        }

        // Skip if the attribute contains expressions (e.g., class="foo {bar}")
        // We only check fully static class attributes
        const hasExpression = node.value.some(
          /** @param {any} part */
          (part) => part.type !== "SvelteLiteral"
        );
        if (hasExpression) {
          return;
        }

        // Create adapter for the core rule
        const adapter = attributeNodeAdapter(node);

        const results = ruleCore.checkClassAttribute(adapter);

        for (const result of results) {
          const normalizedValue = result.data.normalized;

          // Since we only process fully static attributes,
          // there should be exactly one SvelteLiteral value part
          const valuePart = node.value[0];

          let loc;
          if (result.spacingType === "start") {
            loc = {
              start: {
                line: valuePart.loc.start.line,
                column: valuePart.loc.start.column,
              },
              end: {
                line: valuePart.loc.start.line,
                column: valuePart.loc.start.column + result.spacingLength,
              },
            };
          } else if (result.spacingType === "end") {
            const attrValue = valuePart.value;
            loc = {
              start: {
                line: valuePart.loc.start.line,
                column: valuePart.loc.start.column + attrValue.trimEnd().length,
              },
              end: {
                line: valuePart.loc.start.line,
                column: valuePart.loc.start.column + attrValue.length,
              },
            };
          } else {
            // between
            loc = {
              start: {
                line: valuePart.loc.start.line,
                column: valuePart.loc.start.column + result.spacingIndex,
              },
              end: {
                line: valuePart.loc.start.line,
                column:
                  valuePart.loc.start.column +
                  result.spacingIndex +
                  result.spacingLength,
              },
            };
          }

          context.report({
            node: valuePart,
            loc,
            messageId: result.messageId,
            /** @param {any} fixer */
            fix(fixer) {
              return fixer.replaceTextRange(valuePart.range, normalizedValue);
            },
          });
        }
      },
    };
  },
};

export default rule;
