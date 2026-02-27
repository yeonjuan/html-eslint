/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 * @file Disallow HTML attributes that have no effect in their context for
 *   Svelte
 */

import {
  noIneffectiveAttrs,
  NO_INEFFECTIVE_ATTRS_MESSAGE_IDS,
} from "@html-eslint/core";
import { elementNodeAdapter } from "./utils/adapter.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow HTML attributes that have no effect in their context",
      recommended: true,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/no-ineffective-attrs",
    },
    schema: [],
    messages: {
      [NO_INEFFECTIVE_ATTRS_MESSAGE_IDS.ineffective]: "{{ message }}",
    },
  },

  create(context) {
    const ruleCore = noIneffectiveAttrs();

    /**
     * Check if an element has ineffective attributes
     *
     * @param {SvelteElement} node
     */
    function checkElement(node) {
      const adapter = elementNodeAdapter(node);
      const result = ruleCore.checkAttributes(adapter);

      for (const r of result) {
        context.report({
          node: r.node || undefined,
          messageId: r.messageId,
          data: r.data,
        });
      }
    }

    return {
      SvelteElement: checkElement,
    };
  },
};

export default rule;
