const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  INVALID: "invalid",
};

const VALID_CONTAINERS = ["ul", "ol", "menu"];

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

  create(context) {
    return {
      Tag(node) {
        if (node.name !== "li") {
          return;
        }
        if (!node.parent) {
          context.report({
            node,
            messageId: MESSAGE_IDS.INVALID,
          });
        } else if (!VALID_CONTAINERS.includes(node.parent.name || "")) {
          context.report({
            node,
            messageId: MESSAGE_IDS.INVALID,
          });
        }
      },
    };
  },
};
