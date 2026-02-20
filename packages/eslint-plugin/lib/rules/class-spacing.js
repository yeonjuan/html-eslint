/** @import {RuleModule} from "../types" */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const {
  classSpacing,
  CLASS_SPACING_MESSAGE_IDS,
} = require("@html-eslint/core");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "Disallow extra spacing in class attribute values",
      recommended: false,
      category: RULE_CATEGORY.STYLE,
      url: getRuleUrl("class-spacing"),
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

    return createVisitors(context, {
      Attribute(node) {
        if (node.key.value.toLowerCase() !== "class") {
          return;
        }

        const attributeValue = node.value;
        if (
          !attributeValue ||
          !attributeValue.value ||
          attributeValue.parts.some((part) => part.type === NODE_TYPES.Template)
        ) {
          return;
        }

        // Create an attribute adapter
        const attributeAdapter = {
          key: {
            node: () => node.key,
            isExpression: () => false,
            value: () => node.key.value,
            raw: () => node.key.value,
          },
          value: {
            node: () => attributeValue,
            isExpression: () => false,
            value: () => attributeValue.value,
          },
        };

        const results = ruleCore.checkClassAttribute(attributeAdapter);

        for (const result of results) {
          const normalizedValue = result.data.normalized;

          let loc;
          if (result.spacingType === "start") {
            loc = {
              start: {
                line: attributeValue.loc.start.line,
                column: attributeValue.loc.start.column,
              },
              end: {
                line: attributeValue.loc.start.line,
                column: attributeValue.loc.start.column + result.spacingLength,
              },
            };
          } else if (result.spacingType === "end") {
            const classValue = attributeValue.value;
            loc = {
              start: {
                line: attributeValue.loc.start.line,
                column:
                  attributeValue.loc.start.column + classValue.trimEnd().length,
              },
              end: {
                line: attributeValue.loc.start.line,
                column: attributeValue.loc.start.column + classValue.length,
              },
            };
          } else {
            // between
            loc = {
              start: {
                line: attributeValue.loc.start.line,
                column: attributeValue.loc.start.column + result.spacingIndex,
              },
              end: {
                line: attributeValue.loc.start.line,
                column:
                  attributeValue.loc.start.column +
                  result.spacingIndex +
                  result.spacingLength,
              },
            };
          }

          context.report({
            loc,
            messageId: result.messageId,
            fix(fixer) {
              return fixer.replaceTextRange(
                attributeValue.range,
                normalizedValue
              );
            },
          });
        }
      },
    });
  },
};
