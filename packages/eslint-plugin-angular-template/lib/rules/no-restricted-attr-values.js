/** @import {RuleModule} from "../types" */
const {
  noRestrictedAttrValues,
  NO_RESTRICTED_ATTR_VALUES_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createElementAdapter } = require("../adapters/element/factory");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow specified attribute values",
      category: "Best Practice",
      recommended: false,
      url: "https://html-eslint.org/docs/angular-template/rules/no-restricted-attr-values",
    },
    fixable: null,
    schema: {
      type: "array",
      items: {
        type: "object",
        required: ["attrPatterns", "attrValuePatterns"],
        properties: {
          attrPatterns: {
            type: "array",
            items: { type: "string" },
          },
          attrValuePatterns: {
            type: "array",
            items: { type: "string" },
          },
          message: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    },
    messages: {
      [NO_RESTRICTED_ATTR_VALUES_MESSAGE_IDS.restricted]:
        "'{{attrValuePatterns}}' is restricted from being used.",
    },
  },

  create(context) {
    const { checkAttributes } = noRestrictedAttrValues(context.options);

    return {
      Element(node) {
        if (node.name.includes("-")) {
          return;
        }
        const adapter = createElementAdapter(node);
        const result = checkAttributes(adapter);
        for (const item of result) {
          context.report({
            loc: item.loc,
            ...("messageId" in item
              ? { messageId: item.messageId }
              : { message: item.message }),
            data: item.data,
          });
        }
      },
    };
  },
};
