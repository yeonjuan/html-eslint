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
      [["Tag", "ScriptTag", "StyleTag"].join(",")](node) {
        const accessKeyAttr = NodeUtils.findAttr(node, "accesskey");
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
