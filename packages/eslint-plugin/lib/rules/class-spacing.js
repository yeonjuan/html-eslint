/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const {
  classSpacing,
  CLASS_SPACING_MESSAGE_IDS,
} = require("@html-eslint/core");
const { attributeNodeAdapter } = require("./utils/adapter");

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
        const adapter = attributeNodeAdapter(node.key, node.value);
        if (node.key.value.toLowerCase() !== "class") {
          return;
        }
        const attrValueNode = adapter.value.node();
        if (!attrValueNode) {
          return;
        }

        const results = ruleCore.checkClassAttribute(adapter);

        for (const result of results) {
          const normalizedValue = result.data.normalized;

          let loc;
          if (result.spacingType === "start") {
            loc = {
              start: {
                line: attrValueNode.loc.start.line,
                column: attrValueNode.loc.start.column,
              },
              end: {
                line: attrValueNode.loc.start.line,
                column: attrValueNode.loc.start.column + result.spacingLength,
              },
            };
          } else if (result.spacingType === "end") {
            const classValue = attrValueNode.value;
            loc = {
              start: {
                line: attrValueNode.loc.start.line,
                column:
                  attrValueNode.loc.start.column + classValue.trimEnd().length,
              },
              end: {
                line: attrValueNode.loc.start.line,
                column: attrValueNode.loc.start.column + classValue.length,
              },
            };
          } else {
            // between
            loc = {
              start: {
                line: attrValueNode.loc.start.line,
                column: attrValueNode.loc.start.column + result.spacingIndex,
              },
              end: {
                line: attrValueNode.loc.start.line,
                column:
                  attrValueNode.loc.start.column +
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
                attrValueNode.range,
                normalizedValue
              );
            },
          });
        }
      },
    });
  },
};
