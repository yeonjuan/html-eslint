/**
 * @import {IdNamingConventionOptions} from "@html-eslint/core"
 * @import {RuleModule} from "../types"
 */
const {
  idNamingConvention,
  ID_NAMING_CONVENTIONS,
  ID_NAMING_CONVENTION_MESSAGE_IDS,
} = require("@html-eslint/core");
const { AST_NODE_TYPES } = require("../constants/node-types");
const { createElementAdapter } = require("../adapters/element/factory");

/** @type {RuleModule<IdNamingConventionOptions>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce consistent naming of id attributes",
      category: "Style",
      recommended: false,
      url: "https://html-eslint.org/docs/react/rules/id-naming-convention",
    },

    fixable: null,
    schema: [
      {
        enum: Object.values(ID_NAMING_CONVENTIONS),
      },
      {
        type: "object",
        properties: {
          pattern: { type: "string" },
          flags: { type: "string" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [ID_NAMING_CONVENTION_MESSAGE_IDS.wrong]:
        "The id '{{actual}}' is not matched with the {{convention}}.",
    },
  },

  create(context) {
    const { checkAttributes } = idNamingConvention(context.options);

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
            messageId: item.messageId,
            data: item.data,
          });
        }
      },
    };
  },
};
