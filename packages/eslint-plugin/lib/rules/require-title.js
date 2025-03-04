/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").Text } Text
 * @typedef { import("@html-eslint/types").AnyNode } AnyNode
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { find } = require("./utils/array");
const { isText, isTag } = require("./utils/node");

const MESSAGE_IDS = {
  MISSING_TITLE: "missing",
  EMPTY_TITLE: "empty",
};

/**
 * @param {AnyNode} node
 * @returns {node is Tag}
 */
function isTitle(node) {
  return isTag(node) && node.name === "title";
}

/**
 * @param {AnyNode} node
 * @returns {node is Text}
 */
function isNonEmptyText(node) {
  return isText(node) && node.value.trim().length > 0;
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
