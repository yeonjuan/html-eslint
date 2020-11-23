/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

/**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");

const MESSAGE_IDS = {
  MULTIPLE_H1: "unexpectedMultiH1",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow multiple `<h1></h1>`.",
      category: CATEGORY.SEO,
      recommended: true,
    },

    fixable: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.MULTIPLE_H1]: "unexpected multiple `<h1></h1>`.",
    },
  },

  create(context) {
    const h1s = [];

    return {
      H1(node) {
        h1s.push(node);
      },
      "Program:exit"() {
        if (h1s.length > 1) {
          h1s.forEach((h1) => {
            context.report({
              node: h1,
              messageId: MESSAGE_IDS.MULTIPLE_H1,
            });
          });
        }
      },
    };
  },
};
