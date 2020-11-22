/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

/**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");

const MESSAGE_IDS = {
  MISSING_ALT: "missingAlt",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "require `alt` attribute at `<img>` tag",
      category: CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING_ALT]: "missing `alt` attribute at `<img>` tag",
    },
  },

  create(context) {
    return {
      img(node) {
        if (!hasAltAttrAndValue(node)) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.MISSING_ALT,
          });
        }
      },
    };
  },
};

function hasAltAttrAndValue(node) {
  return (node.attrs || []).some((attr) => {
    return attr.name === "alt" && attr.value.trim().length > 0;
  });
}
