/**
 * @import {
 *   JSXAttribute,
 *   JSXOpeningElement,
 *   JSXSpreadAttribute,
 *   RuleModule
 * } from "../types"
 */
const { NO_INVALID_ATTR_VALUE_MESSAGE_IDS } = require("@html-eslint/core");
const { elementNodeAdapter } = require("./utils/adapter");
const { noInvalidAttrValue } = require("@html-eslint/core");
const { AST_NODE_TYPES } = require("../constants/node-types");
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
      url: "https://html-eslint.org/docs/react/rules/no-invalid-attr-value",
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
    const ruleCore = /**
     * @type {ReturnType<
     *   typeof noInvalidAttrValue<
     *     JSXOpeningElement,
     *     JSXSpreadAttribute | JSXAttribute["name"] | null,
     *     JSXAttribute["value"]
     *   >
     * >}
     */ (noInvalidAttrValue(options));
    return {
      JSXOpeningElement(node) {
        if (
          node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          node.name.name.toLocaleLowerCase() !== node.name.name ||
          node.name.name.includes("-")
        ) {
          return;
        }
        const adapter = elementNodeAdapter(node);
        const result = ruleCore.checkAttributes(adapter);
        for (const r of result) {
          context.report({
            node: r.node || undefined,
            messageId: r.messageId,
            data: r.data,
          });
        }
      },
    };
  },
};
