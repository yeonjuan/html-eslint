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
      description: "Disallow to use of accesskey attribute",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected use of accesskey attribute.",
    },
  },

  create(context) {
    return {
      /**
       * @param {TagNode | ScriptTagNode | StyleTagNode} node
       */
      [["Tag", "ScriptTag", "StyleTag"].join(",")](node) {
        const accessKeyAttr = findAttr(node, "accesskey");
        if (accessKeyAttr) {
          context.report({
            node: accessKeyAttr,
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    };
  },
};
