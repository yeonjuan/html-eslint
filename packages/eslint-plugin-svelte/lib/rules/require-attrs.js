/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 */

import { requireAttrs, REQUIRE_ATTRS_MESSAGE_IDS } from "@html-eslint/core";
import { createElementAdapter } from "../adapters/element/factory.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "code",
    docs: {
      description: "Require specified attributes",
      recommended: false,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/require-attrs",
    },
    fixable: "code",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tag: { type: "string" },
          attr: { type: "string" },
          value: { type: "string" },
          message: { type: "string" },
          conditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                attr: { type: "string" },
                value: { type: "string" },
                kind: {
                  enum: ["present", "absent", "equal", "not-equal"],
                },
              },
              required: ["attr", "kind"],
              additionalProperties: false,
            },
          },
        },
        required: ["tag", "attr"],
        additionalProperties: false,
      },
    },
    messages: {
      [REQUIRE_ATTRS_MESSAGE_IDS.missing]:
        "Missing '{{attr}}' attribute on '{{tag}}' tag",
      [REQUIRE_ATTRS_MESSAGE_IDS.unexpected]:
        "Unexpected '{{attr}}' attribute value. '{{expected}}' is expected",
    },
  },

  create(context) {
    const { checkElement } = requireAttrs(context.options);

    /** @param {SvelteElement} node */
    function checkSvelteElement(node) {
      const adapter = createElementAdapter(node);
      const result = checkElement(adapter);
      for (const item of result) {
        context.report({
          loc: item.loc,
          ...("messageId" in item
            ? { messageId: item.messageId }
            : { message: item.message }),
          data: item.data,
          fix: item.fix
            ? (
                (fix) => (fixer) =>
                  fixer.replaceTextRange(fix.range, fix.text)
              )(item.fix)
            : null,
        });
      }
    }

    return {
      SvelteElement: checkSvelteElement,
    };
  },
};

export default rule;
