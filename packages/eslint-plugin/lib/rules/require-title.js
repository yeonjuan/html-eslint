/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {import("es-html-parser").TagNode} TagNode
 * @typedef {import("es-html-parser").TextNode} TextNode
 */
const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  MISSING_TITLE: "missing",
  EMPTY_TITLE: "empty",
};

/**
 * Checks whether the node is a title TagNode.
 * @param {TagNode['children'][number]} node A node to check
 * @returns {node is TagNode} Returns true if the given node is a title TagNode, otherwise false
 */
function isTitleTagNode(node) {
  return node.type === "Tag" && node.name === "title";
}

/**
 * Checks whether the node is a TextNode that has value.
 * @param {TagNode['children'][number]} node A node to check
 * @returns {node is TextNode} Returns true if the given node is a TextNode with non-empty value, otherwise false
 */
function isNonEmptyTextNode(node) {
  return node.type === "Text" && node.value.trim().length > 0;
}

/**
 * @type {Rule}
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
        const titleTag = node.children.find(isTitleTagNode);

        if (!titleTag) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING_TITLE,
          });
          return;
        }

        if (isTitleTagNode(titleTag)) {
          const titleContentText = titleTag.children.find(isNonEmptyTextNode);

          if (!titleContentText) {
            context.report({
              node: titleTag,
              messageId: MESSAGE_IDS.EMPTY_TITLE,
            });
          }
        }
      },
    };
  },
};
