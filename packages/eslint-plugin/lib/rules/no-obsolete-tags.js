/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { RULE_CATEGORY, OBSOLETE_TAGS } = require("../constants");
const { createVisitors } = require("./utils/visitors");

const OBSOLETE_TAGS_SET = new Set(OBSOLETE_TAGS);

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule}
 */
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
    return createVisitors(context, {
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
    });
  },
};
