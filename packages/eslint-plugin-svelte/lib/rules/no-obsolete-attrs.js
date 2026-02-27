/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 * @file Disallow use of obsolete attributes in HTML5 for Svelte
 */

import {
  noObsoleteAttrs,
  NO_OBSOLETE_ATTRS_MESSAGE_IDS,
} from "@html-eslint/core";
import { elementNodeAdapter } from "./utils/adapter.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow use of obsolete attributes in HTML5",
      recommended: true,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/no-obsolete-attrs",
    },
    schema: [],
    messages: {
      [NO_OBSOLETE_ATTRS_MESSAGE_IDS.obsolete]:
        "The {{attr}} attribute on <{{element}}> is obsolete. {{suggestion}}",
    },
  },

  create(context) {
    const ruleCore = noObsoleteAttrs();

    /**
     * Check if an element uses obsolete attributes
     *
     * @param {SvelteElement} node
     */
    function checkElement(node) {
      const adapter = elementNodeAdapter(node);
      const result = ruleCore.checkAttributes(adapter);
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
