/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY, NODE_TYPES } = require("../constants");

const MESSAGE_IDS = {
  INVALID: "invalid",
};

const VALID_CONTAINERS = [NODE_TYPES.UL, NODE_TYPES.OL, NODE_TYPES.MENU];

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce `<li>` to be in  `<ul>`, `<ol>` or `<menu>`.",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.INVALID]:
        "Invalid container of `<li>`. <li>` should be in `<ul>`, `<ol>` or `<menu>`.",
    },
  },

  create(context) {
    return {
      Li(node) {
        if (!node.parent) {
          context.report({
            node,
            messageId: MESSAGE_IDS.INVALID,
          });
        } else if (!VALID_CONTAINERS.includes(node.parent.type || "")) {
          context.report({
            node,
            messageId: MESSAGE_IDS.INVALID,
          });
        }
      },
    };
  },
};
