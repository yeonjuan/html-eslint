/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        'Disallow use of `user-scalable=no` in `<meta name="viewport">`.',
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected use of `user-scalable=no`.",
    },
  },

  create(context) {
    return {
      Tag(node) {
        if (node.name !== "meta") {
          return;
        }
        const nameAttr = NodeUtils.findAttr(node, "name");
        const contentAttr = NodeUtils.findAttr(node, "content");
        if (
          nameAttr &&
          nameAttr.value &&
          contentAttr &&
          contentAttr.value &&
          nameAttr.value.value.toLowerCase() === "viewport" &&
          contentAttr.value.value.match(/user-scalable\s*=\s*no/i)
        ) {
          context.report({
            node: contentAttr,
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    };
  },
};
