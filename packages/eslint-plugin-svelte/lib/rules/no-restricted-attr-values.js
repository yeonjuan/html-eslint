/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 */

import {
  noRestrictedAttrValues,
  NO_RESTRICTED_ATTR_VALUES_MESSAGE_IDS,
} from "@html-eslint/core";
import { createElementAdapter } from "../adapters/element/factory.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow specified attribute values",
      recommended: false,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/no-restricted-attr-values",
    },
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

    /** @param {SvelteElement} node */
    function checkElement(node) {
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
    }

    return {
      SvelteElement: checkElement,
    };
  },
};

export default rule;
