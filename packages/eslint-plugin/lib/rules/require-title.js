/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

/**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");

const MESSAGE_IDS = {
  MISSING_TITLE: "missingTitle",
  EMPTY_TITLE: "emptyTitle",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `<title><title/>` in the `<head><head/>`",
      category: CATEGORY.SEO,
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
      Head(node) {
        const titleTag = (node.childNodes || []).find(
          (node) => node.type === "Title"
        );

        if (!titleTag) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING_TITLE,
          });
        } else if (
          !(titleTag.childNodes || []).some(
            (node) => node.type === "text" && node.value.trim().length > 0
          )
        ) {
          context.report({
            node: titleTag,
            messageId: MESSAGE_IDS.EMPTY_TITLE,
          });
        }
      },
    };
  },
};
