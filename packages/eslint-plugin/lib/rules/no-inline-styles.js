/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  INLINE_STYLE: "unexpectedInlineStyle",
};

/**
 * @type {Rule}
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
    return {
      "*"(node) {
        if (NodeUtils.hasAttr(node, "style")) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.INLINE_STYLE,
          });
        }
      },
    };
  },
};
