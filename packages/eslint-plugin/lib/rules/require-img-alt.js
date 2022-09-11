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
      Tag(node) {
        if (node.name !== "img") {
          return;
        }
        if (!hasAltAttrAndValue(node)) {
          context.report({
            node: {
              loc: {
                start: node.openStart.loc.start,
                end: node.openEnd.loc.end,
              },
              range: [node.openStart.range[0], node.openEnd.range[1]],
            },
            messageId: MESSAGE_IDS.MISSING_ALT,
          });
        }
      },
    };
  },
};

function hasAltAttrAndValue(node) {
  return node.attributes.some((attr) => {
    if (attr.key && attr.value) {
      return attr.key.value === "alt" && typeof attr.value.value === "string";
    }
  });
}
