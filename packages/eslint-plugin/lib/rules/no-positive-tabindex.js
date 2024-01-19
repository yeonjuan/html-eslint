/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").StyleTagNode } StyleTagNode
 * @typedef { import("../types").ScriptTagNode } ScriptTagNode
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule}
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
      /**
       * @param {TagNode | StyleTagNode | ScriptTagNode} node
       */
      [["Tag", "StyleTag", "ScriptTag"].join(",")](node) {
        const tabIndexAttr = findAttr(node, "tabindex");
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
