/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { findParent, isTag } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

const HEADING_NAMES = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallows the use of heading elements inside <button>.",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected heading inside button",
    },
  },

  create(context) {
    return createVisitors(context, {
      Tag(node) {
        if (!HEADING_NAMES.has(node.name.toLowerCase())) {
          return;
        }
        const button = findParent(
          node,
          (parent) => isTag(parent) && parent.name.toLowerCase() === "button"
        );

        if (button) {
          context.report({
            node,
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    });
  },
};
