const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  MISSING_ALT: "missingAlt",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `alt` attribute at `<img>` tag",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING_ALT]: "Missing `alt` attribute at `<img>` tag",
    },
  },

  create(context) {
    return {
      Img(node) {
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
