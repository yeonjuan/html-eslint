/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  INVALID: "invalid",
};

const VALID_CONTAINERS = ["ul", "ol", "menu"];

/**
 * @type {RuleModule}
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
      Tag(node) {
        if (node.name !== "li") {
          return;
        }
        if (!node.parent || node.parent.type === NODE_TYPES.Document) {
          context.report({
            node,
            messageId: MESSAGE_IDS.INVALID,
          });
        } else if (
          node.parent.type === NODE_TYPES.Tag &&
          !VALID_CONTAINERS.includes(node.parent.name || "")
        ) {
          context.report({
            node,
            messageId: MESSAGE_IDS.INVALID,
          });
        }
      },
    };
  },
};
