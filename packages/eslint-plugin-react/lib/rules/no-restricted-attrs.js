/** @import {RuleModule} from "../types" */
const {
  noRestrictedAttrs,
  NO_RESTRICTED_ATTRS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { AST_NODE_TYPES } = require("../constants/node-types");
const { createElementAdapter } = require("../adapters/element/factory");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow specified attributes",
      category: "Best Practice",
      recommended: false,
      url: "https://html-eslint.org/docs/react/rules/no-restricted-attrs",
    },

    fixable: null,
    schema: {
      type: "array",
      items: {
        type: "object",
        required: ["tagPatterns", "attrPatterns"],
        properties: {
          tagPatterns: {
            type: "array",
            items: { type: "string" },
          },
          attrPatterns: {
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
      [NO_RESTRICTED_ATTRS_MESSAGE_IDS.restricted]:
        "'{{attr}}' is restricted from being used.",
    },
  },

  create(context) {
    const { checkAttributes } = noRestrictedAttrs(context.options);

    return {
      JSXElement(node) {
        if (
          node.openingElement.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          node.openingElement.name.name.toLocaleLowerCase() !==
            node.openingElement.name.name
        ) {
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
