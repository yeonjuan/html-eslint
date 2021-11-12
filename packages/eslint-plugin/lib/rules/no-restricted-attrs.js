/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  RESTRICTED: "restricted",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow specified attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.RESTRICTED]: "'{{name}}' is restricted from being used.",
    },
  },

  create() {
    return {
      "*"() {},
    };
  },
};
