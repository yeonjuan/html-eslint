/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const MESSAGE_IDS = {
  INLINE_STYLE: "unexpectedInlineStyle",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow using inline style",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.INLINE_STYLE]: "Unexpected usage of inline style",
    },
  },

  create(context) {
    return createVisitors(context, {
      Tag(node) {
        const styleAttr = findAttr(node, "style");
        if (styleAttr) {
          context.report({
            node: styleAttr,
            messageId: MESSAGE_IDS.INLINE_STYLE,
          });
        }
      },
    });
  },
};
