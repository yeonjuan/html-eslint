/** @import {RuleModule} from "../types" */

const {
  noDuplicateClass,
  NO_DUPLICATE_CLASS_MESSAGE_IDS,
} = require("@html-eslint/core");
const {
  createAttributeValueAdapter,
} = require("../adapters/attribute-value/factory");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallow duplicate class names",
      recommended: true,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/angular-template/rules/no-duplicate-class",
    },
    fixable: "code",
    schema: [],
    messages: {
      [NO_DUPLICATE_CLASS_MESSAGE_IDS.duplicateClass]:
        "The class '{{className}}' is duplicated.",
    },
  },

  create(context) {
    const { checkClassValue } = noDuplicateClass();

    return {
      TextAttribute(node) {
        if (node.name.toLowerCase() !== "class") {
          return;
        }
        const adapter = createAttributeValueAdapter(node);
        const result = checkClassValue(adapter);
        for (const { loc, messageId, range, data } of result) {
          context.report({
            loc,
            messageId,
            data,
            fix(fixer) {
              return fixer.removeRange(range);
            },
          });
        }
      },
    };
  },
};
