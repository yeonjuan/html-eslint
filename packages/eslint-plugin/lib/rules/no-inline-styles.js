const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  INLINE_STYLE: "unexpectedInlineStyle",
};

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
      Tag(node) {
        const styleAttr = NodeUtils.findAttr(node, "style");
        if (styleAttr) {
          context.report({
            node: styleAttr,
            messageId: MESSAGE_IDS.INLINE_STYLE,
          });
        }
      },
    };
  },
};
