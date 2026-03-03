/** @import {RuleModule} from "../types" */
const {
  noInvalidAttrValue,
  NO_INVALID_ATTR_VALUE_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createElementAdapter } = require("../adapters/element/factory");

/**
 * @type {RuleModule<
 *   [{ allow?: { tag: string; attr: string; valuePattern?: string }[] }]
 * >}
 */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow invalid attribute values according to HTML standards",
      category: "Best Practice",
      recommended: true,
      url: "https://html-eslint.org/docs/angular-template/rules/no-invalid-attr-value",
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          allow: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tag: {
                  type: "string",
                },
                attr: {
                  type: "string",
                },
                valuePattern: {
                  type: "string",
                },
              },
              required: ["tag", "attr"],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [NO_INVALID_ATTR_VALUE_MESSAGE_IDS.invalid]:
        "Invalid value '{{value}}' for attribute '{{attr}}' on <{{element}}>. {{suggestion}}",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const { checkAttributes } = noInvalidAttrValue(options);

    return {
      Element(node) {
        if (node.name.includes("-")) {
          return;
        }
        const adapter = createElementAdapter(node);
        const result = checkAttributes(adapter);
        for (const { loc, messageId, data } of result) {
          context.report({
            loc,
            messageId,
            data,
          });
        }
      },
    };
  },
};
