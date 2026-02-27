/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 * @file Disallow invalid attribute values according to HTML standards for
 *   Svelte
 */

import {
  noInvalidAttrValue,
  NO_INVALID_ATTR_VALUE_MESSAGE_IDS,
} from "@html-eslint/core";
import { elementNodeAdapter } from "./utils/adapter.js";
import { AST_NODE_TYPES } from "../constants/node-types.js";

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
     * @param {SvelteElement} node
     */
    function checkElement(node) {
      const adapter = elementNodeAdapter(node);
      const result = ruleCore.checkAttributes(adapter);

      for (const { node, messageId, data } of result) {
        // For Svelte, r.node is an array of SvelteLiteral | SvelteMustacheTag
        // We need to find the first SvelteLiteral node for reporting
        let reportNode = node;
        if (Array.isArray(node)) {
          const firstLiteral = node.find(
            (part) => part.type === AST_NODE_TYPES.SvelteLiteral
          );
          reportNode = firstLiteral || node[0];
        }

        context.report({
          node: reportNode || undefined,
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
