/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const {
  noDuplicateClass,
  NO_DUPLICATE_CLASS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { attributeNodeAdapter } = require("./utils/adapter");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallow duplicate class names",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-duplicate-class"),
    },
    fixable: "code",
    schema: [],
    messages: {
      [NO_DUPLICATE_CLASS_MESSAGE_IDS.duplicateClass]:
        "The class '{{class}}' is duplicated.",
    },
  },

  create(context) {
    const ruleCore = noDuplicateClass();

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
          context.report({
            loc: {
              start: {
                line: attrValueNode.loc.start.line,
                column: attrValueNode.loc.start.column + result.classIndex,
              },
              end: {
                line: attrValueNode.loc.start.line,
                column:
                  attrValueNode.loc.start.column +
                  result.classIndex +
                  result.className.length,
              },
            },
            data: result.data,
            messageId: result.messageId,
            fix(fixer) {
              if (!node.value) {
                return null;
              }

              const startRange = result.hasSpacesBefore
                ? attrValueNode.range[0] + result.spacesBeforePos
                : attrValueNode.range[0] + result.classIndex;

              const endRange = result.hasSpacesAfter
                ? attrValueNode.range[0] +
                  result.classIndex +
                  result.classLength +
                  result.spacesAfterLength
                : attrValueNode.range[0] +
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
    });
  },
};
