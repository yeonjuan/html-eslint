/**
 * @typedef { import("../types").RuleModule } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  MISSING: "missing",
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `title` in `<frame>`, `<iframe>`",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: false,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing `title` attribute in {{frame}}.",
    },
  },

  create(context) {
    return createVisitors(context, {
      Tag(node) {},
    });
  },
};
