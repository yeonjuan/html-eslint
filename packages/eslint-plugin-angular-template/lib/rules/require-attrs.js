/** @import {RuleModule} from "../types" */
const {
  requireAttrs,
  REQUIRE_ATTRS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createElementAdapter } = require("../adapters/element/factory");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Require specified attributes",
      category: "Best Practice",
      recommended: false,
      url: "https://html-eslint.org/docs/angular-template/rules/require-attrs",
    },
    fixable: null,
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tag: { type: "string" },
          attr: { type: "string" },
          value: { type: "string" },
          message: { type: "string" },
          conditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                attr: { type: "string" },
                value: { type: "string" },
                kind: {
                  enum: ["present", "absent", "equal", "not-equal"],
                },
              },
              required: ["attr", "kind"],
              additionalProperties: false,
            },
          },
        },
        required: ["tag", "attr"],
        additionalProperties: false,
      },
    },
    messages: {
      [REQUIRE_ATTRS_MESSAGE_IDS.missing]:
        "Missing '{{attr}}' attribute on '{{tag}}' tag",
      [REQUIRE_ATTRS_MESSAGE_IDS.unexpected]:
        "Unexpected '{{attr}}' attribute value. '{{expected}}' is expected",
    },
  },

  create(context) {
    const { checkElement } = requireAttrs(context.options);

    return {
      Element(node) {
        if (node.name.includes("-")) {
          return;
        }
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
