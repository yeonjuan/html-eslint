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
      description: "Disallow use of positive `tabindex`.",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected use of positive `tabindex`.",
    },
  },

  create(context) {
    return {
      [["Tag", "StyleTag", "ScriptTag"].join(",")](node) {
        const tabIndexAttr = NodeUtils.findAttr(node, "tabindex");
        if (
          tabIndexAttr &&
          tabIndexAttr.value &&
          parseInt(tabIndexAttr.value.value, 10) > 0
        ) {
          context.report({
            node: tabIndexAttr,
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    };
  },
};
