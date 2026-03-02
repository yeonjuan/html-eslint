/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 * @file Disallow invalid attribute values according to HTML standards for
 *   Svelte
 */

import {
  noInvalidAttrValue,
  NO_INVALID_ATTR_VALUE_MESSAGE_IDS,
} from "@html-eslint/core";
import { createElementAdapter } from "../adapters/element/factory.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow invalid attribute values according to HTML standards",
      recommended: true,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/no-invalid-attr-value",
    },
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

    /** @param {SvelteElement} node */
    function checkElement(node) {
      const adapter = createElementAdapter(node);
      const result = checkAttributes(adapter);

      for (const { loc, messageId, data } of result) {
        context.report({
          loc,
          messageId,
          data,
        });
      }
    }

    return {
      SvelteElement: checkElement,
    };
  },
};

export default rule;
