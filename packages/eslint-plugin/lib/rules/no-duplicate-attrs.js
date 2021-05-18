/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  DUPLICATE_ATTRS: "duplicateAttrs",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use duplicate attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_ATTRS]:
        "The attribute '{{attrName}}' is duplicated.",
    },
  },

  create(context) {
    return {
      "*"(node) {
        if (Array.isArray(node.attrs)) {
          const attrsSet = new Set();
          node.attrs.forEach((attr) => {
            if (attrsSet.has(attr.name)) {
              context.report({
                node: node.startTag,
                data: {
                  attrName: attr.name,
                },
                messageId: MESSAGE_IDS.DUPLICATE_ATTRS,
              });
            } else {
              attrsSet.add(attr.name);
            }
          });
        }
      },
    };
  },
};
