/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 */

import {
  noRestrictedTags,
  NO_RESTRICTED_TAGS_MESSAGE_IDS,
} from "@html-eslint/core";
import { createElementAdapter } from "../adapters/element/factory.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow specified tags",
      recommended: false,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/no-restricted-tags",
    },
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

    /** @param {SvelteElement} node */
    function check(node) {
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
    }

    return {
      SvelteElement: check,
    };
  },
};

export default rule;
