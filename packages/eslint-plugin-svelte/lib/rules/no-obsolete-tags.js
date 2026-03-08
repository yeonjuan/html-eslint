/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 * @file Disallow use of obsolete elements in HTML5 for Svelte
 */

import {
  noObsoleteTags,
  NO_OBSOLETE_TAGS_MESSAGE_IDS,
} from "@html-eslint/core";
import { createElementAdapter } from "../adapters/element/factory.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow use of obsolete elements in HTML5",
      recommended: true,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/no-obsolete-tags",
    },
    schema: [],
    messages: {
      [NO_OBSOLETE_TAGS_MESSAGE_IDS.unexpected]:
        "Unexpected use of obsolete tag <{{tag}}>",
    },
  },

  create(context) {
    const { checkElement } = noObsoleteTags();

    /** @param {SvelteElement} node */
    function check(node) {
      const adapter = createElementAdapter(node);
      const result = checkElement(adapter);
      for (const { loc, messageId, data } of result) {
        context.report({
          loc,
          messageId,
          data,
        });
      }
    }

    return {
      SvelteElement: check,
    };
  },
};

export default rule;
