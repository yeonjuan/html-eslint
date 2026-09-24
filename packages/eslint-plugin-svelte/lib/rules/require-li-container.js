/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 * @file Require `<li>` to be in `<ul>`, `<ol>` or `<menu>` for Svelte
 */

import {
  requireLiContainer,
  REQUIRE_LI_CONTAINER_MESSAGE_IDS,
} from "@html-eslint/core";
import { createElementAdapter } from "../adapters/element/factory.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce `<li>` to be in `<ul>`, `<ol>` or `<menu>`.",
      recommended: true,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/require-li-container",
    },
    schema: [],
    messages: {
      [REQUIRE_LI_CONTAINER_MESSAGE_IDS.invalid]:
        "Invalid container of `<li>`. <li>` should be in `<ul>`, `<ol>` or `<menu>`.",
    },
  },

  create(context) {
    const { checkElement } = requireLiContainer();

    /** @param {SvelteElement} node */
    function check(node) {
      const adapter = createElementAdapter(node);
      if (node.kind !== "html" || adapter.getElementName() !== "li") {
        return;
      }
      const result = checkElement(adapter);
      for (const { loc, messageId } of result) {
        context.report({
          loc,
          messageId,
        });
      }
    }

    return {
      SvelteElement: check,
    };
  },
};

export default rule;
