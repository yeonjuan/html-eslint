/**
 * @import {RuleModule} from "../types.js"
 * @file Disallow invalid attribute values according to HTML standards for
 *   Svelte
 */

import {
  noInvalidAttrValue,
  NO_INVALID_ATTR_VALUE_MESSAGE_IDS,
} from "@html-eslint/core";
import { elementNodeAdapter } from "./utils/adapter.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow invalid attribute values according to HTML standards",
      recommended: true,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/no-invalid-attr-value",
    },
    schema: [
      {
        type: "object",
        properties: {
          allow: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tag: {
                  type: "string",
                },
                attr: {
                  type: "string",
                },
                valuePattern: {
                  type: "string",
                },
              },
              required: ["tag", "attr"],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [NO_INVALID_ATTR_VALUE_MESSAGE_IDS.invalid]:
        "Invalid value '{{value}}' for attribute '{{attr}}' on <{{element}}>. {{suggestion}}",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const ruleCore = noInvalidAttrValue(options);

    /**
     * Check if an element has invalid attribute values
     *
     * @param {any} node
     */
    function checkElement(node) {
      const adapter = elementNodeAdapter(node);
      const result = ruleCore.checkAttributes(adapter);

      for (const r of result) {
        // For Svelte, r.node is an array of SvelteLiteral | SvelteMustacheTag
        // We need to find the first SvelteLiteral node for reporting
        let reportNode = r.node;
        if (Array.isArray(r.node)) {
          const firstLiteral = r.node.find(
            (part) => part.type === "SvelteLiteral"
          );
          reportNode = firstLiteral || r.node[0];
        }

        context.report({
          node: reportNode || undefined,
          messageId: r.messageId,
          data: r.data,
        });
      }
    }

    return {
      SvelteElement: checkElement,
      SvelteScriptElement: checkElement,
      SvelteStyleElement: checkElement,
    };
  },
};

export default rule;
