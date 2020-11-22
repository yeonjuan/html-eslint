/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

/**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");

const MESSAGE_IDS = {
  MISSING_DOCTYPE: "missingDoctype",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "require `<!DOCTYPE HTML>` in html,",
      category: CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING_DOCTYPE]: "missing `<!DOCTYPE HTML>`",
    },
  },

  create(context) {
    let hasDocType = false;
    return {
      documentType() {
        hasDocType = true;
      },
      "Program:exit"(node) {
        if (!hasDocType) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING_DOCTYPE,
            fix(fixer) {
              return fixer.insertTextBefore(node, "<!DOCTYPE html>\n");
            },
          });
        }
      },
    };
  },
};
