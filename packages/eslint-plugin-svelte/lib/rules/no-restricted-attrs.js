/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 */

import {
  noRestrictedAttrs,
  NO_RESTRICTED_ATTRS_MESSAGE_IDS,
} from "@html-eslint/core";
import { createElementAdapter } from "../adapters/element/factory.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow specified attributes",
      recommended: false,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/no-restricted-attrs",
    },
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
