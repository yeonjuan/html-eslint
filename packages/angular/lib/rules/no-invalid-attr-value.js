const { element } = require("html-standard");

const MESSAGE_IDS = {
  INVALID: "invalid",
};

/** @typedef {import("estree").Node} ESTreeNode */
/**
 * @import {
 *   TmplAstElement,
 *   TmplAstTextAttribute
 * } from "@angular/compiler"
 */

/**
 * @type {import("../types").RuleModule<
 *   [{ allow?: { tag: string; attr: string; valuePattern?: string }[] }]
 * >} >}
 */
module.exports = {
  meta: {
    type: "problem",

    docs: {
      description:
        "Disallow invalid attribute values according to HTML standards",
      category: "Best Practice",
      recommended: false,
      url: "https://github.com/yeonjuan/html-eslint/tree/main/packages/angular",
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
     * Check if attribute value contains Angular expressions Angular expressions
     * include: {{variable}}, [property], (event), etc.
     *
     * @param {TmplAstTextAttribute} node
     * @returns {boolean}
     */
    function hasAngularExpression(node) {
      if (!node || !node.value) {
        return false;
      }

      // Check if the attribute name contains Angular syntax
      const attrName = node.name || "";
      if (
        attrName.startsWith("[") ||
        attrName.startsWith("(") ||
        attrName.startsWith("*") ||
        attrName.startsWith("#")
      ) {
        return true;
      }

      return false;
    }

    /**
     * Check attributes on an Angular element
     *
     * @param {TmplAstElement} node - Angular element node
     */
    function checkAttributes(node) {
      const elementName = node.name;

      if (!elementName || typeof elementName !== "string") {
        return;
      }
      for (const attr of node.attributes || []) {
        // Skip Angular-specific attributes (property bindings, event bindings, etc.)
        const attrName = attr.name;

        if (!attrName) {
          continue;
        }

        // Skip Angular directives and bindings
        if (
          attrName.startsWith("[") ||
          attrName.startsWith("(") ||
          attrName.startsWith("*") ||
          attrName.startsWith("#") ||
          attrName.startsWith("@")
        ) {
          continue;
        }

        // Skip if attribute has Angular expressions
        if (hasAngularExpression(attr)) {
          continue;
        }

        const attrValue = attr.value;

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
              node: /** @type {any} */ (attr),
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
      Element(node) {
        checkAttributes(node);
      },
    };
  },
};
