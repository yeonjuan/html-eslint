/**
 * @import {IdNamingConventionOptions} from "@html-eslint/core"
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 */

import {
  idNamingConvention,
  ID_NAMING_CONVENTIONS,
  ID_NAMING_CONVENTION_MESSAGE_IDS,
} from "@html-eslint/core";
import { createElementAdapter } from "../adapters/element/factory.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce consistent naming of id attributes",
      recommended: false,
      category: "Style",
      url: "https://html-eslint.org/docs/svelte/rules/id-naming-convention",
    },
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
    const { checkAttributes } = idNamingConvention(
      /** @type {IdNamingConventionOptions} */ (context.options)
    );

    /** @param {SvelteElement} node */
    function checkElement(node) {
      const adapter = createElementAdapter(node);
      const result = checkAttributes(adapter);
      for (const item of result) {
        context.report({
          loc: item.loc,
          messageId: item.messageId,
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
