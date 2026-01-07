/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");
const MESSAGE_IDS = {
  EMPTY_BLOCK: "emptyBlock",
};

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallows empty CSS blocks in `<style>` tags.",
      recommended: false,
      category: RULE_CATEGORY.BEST_PRACTICE,
    },
    messages: {
      [MESSAGE_IDS.EMPTY_BLOCK]: "Unexpected empty block found.",
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
            messageId: MESSAGE_IDS.EMPTY_BLOCK,
          });
        }
      },
    };
  },
};
