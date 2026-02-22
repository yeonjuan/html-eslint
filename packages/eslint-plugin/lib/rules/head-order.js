/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");
const { getRuleUrl } = require("./utils/rule");
const { HtmlEslintAdapter } = require("./utils/capo-adapter");
const { analyzeHeadWithOrdering } = require("@rviscomi/capo.js");

const MESSAGE_IDS = {
  WRONG_ORDER: "wrongOrder",
};

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce optimal ordering of elements in `<head>`",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("head-order"),
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.WRONG_ORDER]:
        "{{nextCategory}} element should come before {{currentCategory}} element for optimal performance",
    },
  },

  create(context) {
    const adapter = new HtmlEslintAdapter();

    return {
      Tag(node) {
        if (node.name !== "head") {
          return;
        }
        const analysis = analyzeHeadWithOrdering(node, adapter);

        for (const violation of analysis.orderingViolations) {
          context.report({
            node: violation.nextElement,
            messageId: MESSAGE_IDS.WRONG_ORDER,
            data: {
              nextCategory: violation.nextCategory,
              currentCategory: violation.currentCategory,
            },
          });
        }
      },
    };
  },
};
