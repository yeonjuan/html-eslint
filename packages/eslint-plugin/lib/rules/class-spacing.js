/**
 * @import {RuleModule} from "../types";
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  EXTRA_SPACING_START: "extraSpacingStart",
  EXTRA_SPACING_END: "extraSpacingEnd",
  EXTRA_SPACING_BETWEEN: "extraSpacingBetween",
};

const CLASS_BETWEEN_EXTRA_SPACES_REGEX = /\s{2,}/;

/**
 * @type {RuleModule<[]>}
 */
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
      [MESSAGE_IDS.EXTRA_SPACING_START]:
        "Unexpected space at the start of class attribute value",
      [MESSAGE_IDS.EXTRA_SPACING_END]:
        "Unexpected space at the end of class attribute value",
      [MESSAGE_IDS.EXTRA_SPACING_BETWEEN]:
        "Unexpected extra spaces between class names",
    },
  },

  create(context) {
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

        const classValue = attributeValue.value;
        const trimmedValue = classValue.trim();

        if (classValue === trimmedValue && !CLASS_BETWEEN_EXTRA_SPACES_REGEX.test(classValue)) {
          return;
        }

        const normalizedValue = trimmedValue.replace(/\s+/g, " ");

        // Check for leading spaces
        if (classValue !== trimmedValue && classValue.startsWith(" ")) {
          context.report({
            loc: {
              start: {
                line: attributeValue.loc.start.line,
                column: attributeValue.loc.start.column,
              },
              end: {
                line: attributeValue.loc.start.line,
                column:
                  attributeValue.loc.start.column +
                  (classValue.length - classValue.trimStart().length),
              },
            },
            messageId: MESSAGE_IDS.EXTRA_SPACING_START,
            fix(fixer) {
              return fixer.replaceTextRange(
                attributeValue.range,
                normalizedValue
              );
            },
          });
          return;
        }

        // Check for trailing spaces
        if (classValue !== trimmedValue && classValue.endsWith(" ")) {
          context.report({
            loc: {
              start: {
                line: attributeValue.loc.start.line,
                column:
                  attributeValue.loc.start.column +
                  classValue.trimEnd().length,
              },
              end: {
                line: attributeValue.loc.start.line,
                column: attributeValue.loc.start.column + classValue.length,
              },
            },
            messageId: MESSAGE_IDS.EXTRA_SPACING_END,
            fix(fixer) {
              return fixer.replaceTextRange(
                attributeValue.range,
                normalizedValue
              );
            },
          });
          return;
        }

        // Check for extra spaces between class names
        if (CLASS_BETWEEN_EXTRA_SPACES_REGEX.test(classValue)) {
          const match = classValue.match(CLASS_BETWEEN_EXTRA_SPACES_REGEX);
          if (match && match.index !== undefined) {
            context.report({
              loc: {
                start: {
                  line: attributeValue.loc.start.line,
                  column: attributeValue.loc.start.column + match.index,
                },
                end: {
                  line: attributeValue.loc.start.line,
                  column:
                    attributeValue.loc.start.column +
                    match.index +
                    match[0].length,
                },
              },
              messageId: MESSAGE_IDS.EXTRA_SPACING_BETWEEN,
              fix(fixer) {
                return fixer.replaceTextRange(
                  attributeValue.range,
                  normalizedValue
                );
              },
            });
          }
        }
      },
    });
  },
};
