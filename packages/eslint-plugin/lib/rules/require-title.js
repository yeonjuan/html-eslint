/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY, NODE_TYPES } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSING_TITLE: "missing",
  EMPTY_TITLE: "empty",
};

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
      Head(node) {
        const titleTag = (node.childNodes || []).find(
          (node) => node.type === NODE_TYPES.TITLE
        );

        if (!titleTag) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING_TITLE,
          });
        } else if (
          !(titleTag.childNodes || []).some(
            (node) => NodeUtils.isTextNode(node) && node.value.trim().length > 0
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
