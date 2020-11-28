const { RULE_CATEGORY, NODE_TYPES } = require("../constants");
const { OBSOLETE_TAGS } = require("../constants");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use obsolte elements in HTML5",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "unexpected use an oblsolute tag <{{tag}}>",
    },
  },

  create(context) {
    return {
      "*"(node) {
        if (
          node.type !== NODE_TYPES.PROGRAM &&
          node.tagName &&
          OBSOLETE_TAGS.includes(node.tagName)
        ) {
          context.report({
            node,
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    };
  },
};
