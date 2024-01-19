/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  MISSING_ALT: "missingAlt",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `alt` attribute at `<img>` tag",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: true,
    },

    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          substitute: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    ],
    messages: {
      [MESSAGE_IDS.MISSING_ALT]: "Missing `alt` attribute at `<img>` tag",
    },
  },

  create(context) {
    const substitute =
      (context.options &&
        context.options[0] &&
        context.options[0].substitute) ||
      [];

    return {
      Tag(node) {
        if (node.name !== "img") {
          return;
        }
        if (!hasAltAttrAndValue(node, substitute)) {
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

/**
 *
 * @param {TagNode} node
 * @param {string[]} substitute
 * @returns
 */
function hasAltAttrAndValue(node, substitute = []) {
  return node.attributes.some((attr) => {
    if (attr.key && attr.value) {
      return (
        (attr.key.value === "alt" || substitute.includes(attr.key.value)) &&
        typeof attr.value.value === "string"
      );
    }
    return false;
  });
}
