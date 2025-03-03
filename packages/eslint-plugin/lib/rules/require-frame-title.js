/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
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
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected empty `title`.",
    },
  },

  create(context) {
    return createVisitors(context, {
      Tag(node) {
        if (node.name !== "frame" && node.name !== "iframe") {
          return;
        }
        const title = findAttr(node, "title");
        if (!title) {
          context.report({
            node: node.openStart,
            data: { frame: `<${node.name}>` },
            messageId: MESSAGE_IDS.MISSING,
          });
        } else if (!title.value || title.value.value.trim().length === 0) {
          context.report({
            node: title,
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    });
  },
};
