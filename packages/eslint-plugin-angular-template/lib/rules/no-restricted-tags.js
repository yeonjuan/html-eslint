/** @import {RuleModule} from "../types" */
const {
  noRestrictedTags,
  NO_RESTRICTED_TAGS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createElementAdapter } = require("../adapters/element/factory");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow specified tags",
      category: "Best Practice",
      recommended: false,
      url: "https://html-eslint.org/docs/angular-template/rules/no-restricted-tags",
    },
    fixable: null,
    schema: {
      type: "array",
      items: {
        type: "object",
        required: ["tagPatterns"],
        properties: {
          tagPatterns: {
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
      [NO_RESTRICTED_TAGS_MESSAGE_IDS.restricted]:
        "'{{tag}}' tag is restricted from being used.",
    },
  },

  create(context) {
    const { checkElement } = noRestrictedTags(context.options);

    return {
      Element(node) {
        const adapter = createElementAdapter(node);
        const result = checkElement(adapter);
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
