/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {import("es-html-parser").TagNode} TagNode
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  MISSING_TITLE: "missing",
  EMPTY_TITLE: "empty",
};

function isTitleTag(node) {
  return node.type === "Tag" && node.name === "title";
}

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
        const titleTag = node.children.find(isTitleTag);

        if (!titleTag) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING_TITLE,
          });
          return;
        }

        const hasTitleContent = titleTag.children.some(
          (child) => child.type === "Text" && child.value.trim().length > 0
        );

        if (!hasTitleContent) {
          context.report({
            node: titleTag,
            messageId: MESSAGE_IDS.EMPTY_TITLE,
          });
        }
      },
    };
  },
};
