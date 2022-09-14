/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  MULTIPLE_H1: "unexpectedMultiH1",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow multiple `<h1></h1>`.",
      category: RULE_CATEGORY.SEO,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MULTIPLE_H1]: "Unexpected multiple `<h1></h1>`.",
    },
  },

  create(context) {
    const h1s = [];

    return {
      Tag(node) {
        if (node.name === "h1") {
          h1s.push(node);
        }
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
