const { RULE_CATEGORY } = require("../constants");
const { OBSOLETE_TAGS } = require("../constants");

const OBSOLETE_TAGS_SET = new Set(OBSOLETE_TAGS);

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use obsolete elements in HTML5",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected use of obsolete tag <{{tag}}>",
    },
  },

  create(context) {
    return {
      Tag(node) {
        if (OBSOLETE_TAGS_SET.has(node.name)) {
          context.report({
            node,
            data: {
              tag: node.name,
            },
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    };
  },
};
