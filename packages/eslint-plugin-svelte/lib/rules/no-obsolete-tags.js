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
import { elementNodeAdapter } from "./utils/adapter.js";

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
    const ruleCore = noObsoleteTags();

    /**
     * Check if an element uses an obsolete tag
     *
     * @param {SvelteElement} node
     */
    function checkElement(node) {
      const adapter = elementNodeAdapter(node);
      const result = ruleCore.checkElement(adapter);
      for (const { node, messageId, data } of result) {
        context.report({
          node,
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
