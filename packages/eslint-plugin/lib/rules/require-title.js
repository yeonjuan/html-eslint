/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").TextNode } TextNode
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { find } = require("./utils/array");

const MESSAGE_IDS = {
  MISSING_TITLE: "missing",
  EMPTY_TITLE: "empty",
};

/**
 * @param {import("../types").ChildType<TagNode>} node
 * @returns {node is TagNode}
 */
function isTitle(node) {
  return node.type === NODE_TYPES.Tag && node.name === "title";
}

/**
 * @param {import("../types").ChildType<TagNode>} node
 * @returns {node is TextNode}
 */
function isNonEmptyText(node) {
  return node.type === NODE_TYPES.Text && node.value.trim().length > 0;
}

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `<title><title/>` in the `<head><head/>`",
      category: RULE_CATEGORY.SEO,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING_TITLE]:
        "Missing `<title><title/>` in the `<head><head/>`",
      [MESSAGE_IDS.EMPTY_TITLE]: "Unexpected empty text in `<title><title/>`",
    },
  },
  create(context) {
    return {
      Tag(node) {
        if (node.name !== "head") {
          return;
        }

        const title = find(node.children, isTitle);

        if (!title) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING_TITLE,
          });
          return;
        }

        const content = find(title.children, isNonEmptyText);

        if (!content) {
          context.report({
            node: title,
            messageId: MESSAGE_IDS.EMPTY_TITLE,
          });
        }
      },
    };
  },
};
