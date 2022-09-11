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
        "Disallow to use aria-hidden attributes on the `body` element.",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected aria-hidden on body tag.",
    },
  },

  create(context) {
    return {
      Tag(node) {
        if (node.name !== "body") {
          return;
        }
        const ariaHiddenAttr = NodeUtils.findAttr(node, "aria-hidden");
        if (ariaHiddenAttr) {
          if (
            (ariaHiddenAttr.value && ariaHiddenAttr.value.value !== "false") ||
            !ariaHiddenAttr.value
          ) {
            context.report({
              node: ariaHiddenAttr,
              messageId: MESSAGE_IDS.UNEXPECTED,
            });
          }
        }
      },
    };
  },
};
