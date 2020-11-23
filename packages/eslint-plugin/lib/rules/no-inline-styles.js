/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

/**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");
const utils = require("./utils");

const MESSAGE_IDS = {
  INLINE_STYLE: "unexpectedInlineStyle",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow using inline style",
      category: CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.INLINE_STYLE]: "Unexpected usage of inline style",
    },
  },

  create(context) {
    return {
      "*"(node) {
        if (utils.hasAttr(node, "style")) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.INLINE_STYLE,
          });
        }
      },
    };
  },
};
