/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "FILL ME",
      recommended: false,
      category: RULE_CATEGORY.BEST_PRACTICE,
    },
    messages: {
      emptyBlock: "Unexpected empty block found.",
    },
  },
  fixable: null,
  schema: [],
  create(context) {
    return {
      CssBlock(node) {
        if (node.children.length === 0) {
          context.report({
            loc: node.loc,
            messageId: "emptyBlock",
          });
        }
      },
    };
  },
};
