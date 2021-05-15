/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSING: "missing",
  UNEXPECTED: "unexpected",
};

/**
 * @type {Rule}
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
    return {
      "Frame, Iframe"(node) {
        const title = NodeUtils.findAttr(node, "title");
        if (!title) {
          context.report({
            node: node.startTag,
            data: { frame: `<${node.tagName}>` },
            messageId: MESSAGE_IDS.MISSING,
          });
        } else if (title.value.trim().length === 0) {
          context.report({
            node: title,
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    };
  },
};
