/**
 * @typedef {import("../types").ElementNode} ElementNode
 * @typedef {import("../types").Context} Context
 */

const { RULE_CATEGORY, NODE_TYPES } = require("../constants");

const MESSAGE_IDS = {
  INVALID: "invalid",
};

const VALID_CONTAINERS = [NODE_TYPES.UL, NODE_TYPES.OL, NODE_TYPES.MENU];

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce `<li>` to be in  `<ul>`, `<ol>` or `<menu>`.",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.INVALID]:
        "Invalid container of `<li>`. <li>` should be in `<ul>`, `<ol>` or `<menu>`.",
    },
  },

  /**
   * @param {Context} context 
   */
  create(context) {
    return {
      /**
       * @param {ElementNode} node 
       */
      Li(node) {
        if (!node.parent || !VALID_CONTAINERS.includes(node.parent.type)) {
          context.report({
            node,
            messageId: MESSAGE_IDS.INVALID,
          });
        }
      },
    };
  },
};
