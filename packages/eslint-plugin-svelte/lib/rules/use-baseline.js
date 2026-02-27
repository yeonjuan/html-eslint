/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 * @typedef {Object} Option
 * @property {"widely" | "newly" | number} Option.available
 */

import { useBaseline, USE_BASELINE_MESSAGE_IDS } from "@html-eslint/core";
import { elementNodeAdapter } from "./utils/adapter.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce the use of baseline features",
      recommended: true,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/use-baseline",
    },
    schema: [
      {
        type: "object",
        properties: {
          available: {
            anyOf: [
              {
                enum: ["widely", "newly"],
              },
              {
                // baseline year
                type: "integer",
                minimum: 2000,
                maximum: new Date().getFullYear(),
              },
            ],
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      [USE_BASELINE_MESSAGE_IDS.noBaselineElement]:
        "Element '{{element}}' is not a {{availability}} available baseline feature.",
      [USE_BASELINE_MESSAGE_IDS.notBaselineElementAttribute]:
        "Attribute '{{attr}}' on '{{element}}' is not a {{availability}} available baseline feature.",
      [USE_BASELINE_MESSAGE_IDS.notBaselineGlobalAttribute]:
        "Attribute '{{attr}}' is not a {{availability}} available baseline feature.",
    },
  },

  create(context) {
    const options = context.options[0] || { available: "widely" };
    const ruleCore = useBaseline(options);

    /**
     * Check an element node for baseline features
     *
     * @param {SvelteElement} node
     */
    function checkElement(node) {
      if (node.name.type !== "SvelteName") {
        return;
      }
      if (
        node.name.name.toLowerCase() !== node.name.name ||
        node.name.name.includes("-")
      ) {
        return;
      }

      const adapter = elementNodeAdapter(node);
      const result = ruleCore.checkAttributes(adapter);

      for (const r of result) {
        // r.node might be an array or other structure from Svelte parser
        // Extract the first node if it's an array, or use the element node as fallback
        let reportNode = node;
        if (r.node) {
          if (Array.isArray(r.node) && r.node.length > 0) {
            reportNode = r.node[0];
          } else if (r.node.type) {
            reportNode = r.node;
          }
        }

        context.report({
          messageId: r.messageId,
          data: r.data,
          node: reportNode,
        });
      }
    }

    return {
      SvelteElement: checkElement,
    };
  },
};

export default rule;
