/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 * @typedef { import("@html-eslint/types").Tag } Tag
 */

const { RULE_CATEGORY } = require("../constants");

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
      description: "Disallow skipping heading levels",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]:
        "Unexpected skipping heading level. <h{{expected}}> is expected",
    },
  },

  create(context) {
    /**
     * @type {{node: Tag; level: number}[]}
     */
    const headings = [];

    return {
      Tag(node) {
        if (!["h1", "h2", "h3", "h5", "h6"].includes(node.name)) {
          return;
        }
        headings.push({
          node,
          level: parseInt(node.name.replace("h", ""), 10),
        });
      },
      "Document:exit"() {
        if (headings.length <= 1) {
          return;
        }
        headings.sort((a, b) => a.node.range[0] - b.node.range[0]);
        headings.forEach((current, index) => {
          const next = headings[index + 1];
          if (next) {
            if (next.level - current.level > 1) {
              context.report({
                node: next.node,
                data: { expected: String(current.level + 1) },
                messageId: MESSAGE_IDS.UNEXPECTED,
              });
            }
          }
        });
      },
    };
  },
};
