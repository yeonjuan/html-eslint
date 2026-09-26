/** @import {RuleModule} from "../types" */
const {
  requireLiContainer,
  REQUIRE_LI_CONTAINER_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createElementAdapter } = require("../adapters/element/factory");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Enforce `<li>` to be in `<ul>`, `<ol>` or `<menu>`.",
      category: "Best Practice",
      recommended: true,
      url: "https://html-eslint.org/docs/angular-template/rules/require-li-container",
    },
    fixable: null,
    schema: [],
    messages: {
      [REQUIRE_LI_CONTAINER_MESSAGE_IDS.invalid]:
        "Invalid container of `<li>`. <li>` should be in `<ul>`, `<ol>` or `<menu>`.",
    },
  },

  create(context) {
    const ruleCore = requireLiContainer();

    return {
      Element(node) {
        if (node.name !== "li") {
          return;
        }
        const adapter = createElementAdapter(node);
        const result = ruleCore.checkElement(adapter);
        for (const { loc, messageId } of result) {
          context.report({
            loc,
            messageId,
          });
        }
      },
    };
  },
};
