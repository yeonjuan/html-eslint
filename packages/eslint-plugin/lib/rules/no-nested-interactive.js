/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").Tag } Tag
 */

const { RULE_CATEGORY } = require("../constants");

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
      description: "TODO",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "TODO",
    },
  },

  create(context) {
    return {
      Tag(node) {},
    };
  },
};
