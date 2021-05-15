/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY, NODE_TYPES } = require("../constants");
const { OBSOLETE_TAGS } = require("../constants");

const OBSOLETE_TAGS_SET = new Set(OBSOLETE_TAGS);

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {Rule}
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
    return {
      "*"(node) {
        if (
          node.type !== NODE_TYPES.PROGRAM &&
          node.tagName &&
          OBSOLETE_TAGS_SET.has(node.tagName)
        ) {
          context.report({
            node,
            data: {
              tag: node.tagName,
            },
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    };
  },
};
