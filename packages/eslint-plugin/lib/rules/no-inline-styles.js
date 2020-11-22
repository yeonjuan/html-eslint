/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

/**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");

const MESSAGE_IDS = {
  INLINE_STYLE: "unexpectedInlineStyle",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "disallow using inline style",
      category: CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.INLINE_STYLE]: "Unexpected usage of inline style",
    },
  },

  create(context) {
    return {
      "*"(node) {
        if (
          (node.attrs || []).some((attr) => {
            return attr.name === "style";
          })
        ) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.INLINE_STYLE,
          });
        }
      },
    };
  },
};
