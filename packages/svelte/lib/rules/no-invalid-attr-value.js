import { element } from "html-standard";

const MESSAGE_IDS = {
  INVALID: "invalid",
};

/** @typedef {import("estree").Node} ESTreeNode */

/**
 * @type {import("../types").RuleModule<
 *   [{ allow?: { tag: string; attr: string; valuePattern?: string }[] }]
 * >} >}
 */
export default {
  meta: {
    type: "problem",

    docs: {
      description:
        "Disallow invalid attribute values according to HTML standards",
      category: "Best Practice",
      recommended: false,
      url: "https://github.com/yeonjuan/html-eslint/tree/main/packages/svelte",
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
      [MESSAGE_IDS.INVALID]:
        "Invalid value '{{value}}' for attribute '{{attr}}' on <{{element}}>. {{suggestion}}",
    },
  },

  create(context) {
    console.log(element);
    const options = context.options[0] || {};
    const allowList = options.allow || [];

    /**
     * Check if the attribute should be allowed
     *
     * @param {string} elementName
     * @param {string} attrName
     * @param {string} attrValue
     * @returns {boolean}
     */
    function shouldAllow(elementName, attrName, attrValue) {
      return allowList.some((allowRule) => {
        const tagMatch =
          allowRule.tag.toLowerCase() === elementName.toLowerCase();
        const attrMatch =
          allowRule.attr.toLowerCase() === attrName.toLowerCase();

        if (!tagMatch || !attrMatch) {
          return false;
        }

        if (allowRule.valuePattern === undefined) {
          return true;
        }

        try {
          const regex = new RegExp(allowRule.valuePattern);
          return regex.test(attrValue);
        } catch {
          return false;
        }
      });
    }

    /**
     * Check if attribute value contains Svelte expressions Svelte expressions
     * include: {variable}, {@html}, {#if}, etc.
     *
     * @param {any} valueNodes
     * @returns {boolean}
     */
    function hasSvelteExpression(valueNodes) {
      if (
        !valueNodes ||
        !Array.isArray(valueNodes) ||
        valueNodes.length === 0
      ) {
        return false;
      }

      // If any value node is not a SvelteText (literal string), it contains expressions
      return valueNodes.some(
        (node) => node.type !== "SvelteText" && node.type !== "SvelteLiteral"
      );
    }

    /**
     * Get the string value from Svelte attribute value nodes
     *
     * @param {any} valueNodes
     * @returns {string}
     */
    function getAttributeValue(valueNodes) {
      if (
        !valueNodes ||
        !Array.isArray(valueNodes) ||
        valueNodes.length === 0
      ) {
        return "";
      }

      // Concatenate all text/literal values
      return valueNodes
        .filter(
          (node) => node.type === "SvelteText" || node.type === "SvelteLiteral"
        )
        .map((node) => node.data || node.value || "")
        .join("");
    }

    /**
     * Check attributes on a Svelte element
     *
     * @param {any} node - Svelte element node
     */
    function checkAttributes(node) {
      const elementName = node.name?.name || node.name;

      if (!elementName || typeof elementName !== "string") {
        return;
      }

      for (const attr of node.startTag?.attributes || []) {
        // Skip directives, bindings, and special Svelte attributes
        if (
          attr.type === "SvelteDirective" ||
          attr.type === "SvelteShorthandAttribute" ||
          attr.type === "SvelteSpreadAttribute"
        ) {
          continue;
        }

        if (attr.type !== "SvelteAttribute") {
          continue;
        }

        const attrName = attr.key?.name;
        if (!attrName) {
          continue;
        }

        // Skip if attribute has Svelte expressions
        if (hasSvelteExpression(attr.value)) {
          continue;
        }

        const attrValue = getAttributeValue(attr.value);

        // Check if this attribute is in the allow list
        if (shouldAllow(elementName, attrName, attrValue)) {
          continue;
        }

        // Validate using html-standard
        const validator = element(elementName).attributes.get(attrName);
        if (validator) {
          const result = validator.validateValue(attrValue);
          if (!result.valid) {
            context.report({
              node: attr.value && attr.value.length > 0 ? attr.value[0] : attr,
              messageId: MESSAGE_IDS.INVALID,
              data: {
                value: attrValue,
                attr: attrName,
                element: elementName,
                suggestion: result.reason || "Use a valid value.",
              },
            });
          }
        }
      }
    }

    return {
      SvelteElement(node) {
        checkAttributes(node);
      },
    };
  },
};
