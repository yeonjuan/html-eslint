/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");
const { getRuleUrl } = require("./utils/rule");
const { HtmlEslintAdapter } = require("./utils/capo-adapter");
const { analyzeHeadWithOrdering, getWeight } = require("@rviscomi/capo.js");

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

    fixable: "code",
    schema: [],
    messages: {
      [MESSAGE_IDS.WRONG_ORDER]:
        "{{nextCategory}} element should come before {{currentCategory}} element for optimal performance",
    },
  },

  create(context) {
    const adapter = new HtmlEslintAdapter();
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      Tag(node) {
        if (node.name !== "head") {
          return;
        }
        const analysis = analyzeHeadWithOrdering(node, adapter);

        if (analysis.orderingViolations.length === 0) {
          return;
        }

        const children = adapter.getChildren(node);

        for (const violation of analysis.orderingViolations) {
          context.report({
            node: violation.nextElement,
            messageId: MESSAGE_IDS.WRONG_ORDER,
            data: {
              nextCategory: violation.nextCategory,
              currentCategory: violation.currentCategory,
            },
            fix(fixer) {
              const sortedChildren = [...children].sort((a, b) => {
                const weightA = getWeight(a, adapter);
                const weightB = getWeight(b, adapter);
                return weightB - weightA;
              });

              const fixes = [];

              for (let i = 0; i < children.length; i++) {
                const originalChild = children[i];
                const sortedChild = sortedChildren[i];

                if (originalChild !== sortedChild) {
                  const sortedText = sourceCode.getText(sortedChild);

                  fixes.push(fixer.replaceText(originalChild, sortedText));
                }
              }

              return fixes;
            },
          });
        }
      },
    };
  },
};
