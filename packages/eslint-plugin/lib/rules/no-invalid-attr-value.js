/**
 * @import {
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const { element } = require("html-standard");
const { hasTemplate } = require("./utils/node");

const MESSAGE_IDS = {
  INVALID: "invalid",
};

/**
 * @type {RuleModule<
 *   [{ allow?: { tag: string; attr: string; valuePattern?: string }[] }]
 * >}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        "Disallow invalid attribute values according to HTML standards",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-invalid-attr-value"),
    },

    fixable: null,
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

        const regex = new RegExp(allowRule.valuePattern);
        return regex.test(attrValue);
      });
    }

    /**
     * @param {Tag | ScriptTag | StyleTag} node
     * @param {string} elementName
     */
    function checkAttributes(node, elementName) {
      for (const attr of node.attributes) {
        const key = attr.key.value;

        const value = attr.value ? attr.value.value : "";
        if (attr.value && hasTemplate(attr.value)) {
          continue;
        }

        if (shouldAllow(elementName, key, value)) {
          continue;
        }

        const validator = element(elementName).attributes.get(key);
        if (validator) {
          const result = validator.validateValue(value);
          if (!result.valid) {
            context.report({
              node: attr.value || attr,
              messageId: MESSAGE_IDS.INVALID,
              data: {
                value: `${value}`,
                attr: key,
                element: elementName,
                suggestion: result.reason || "Use a valid value.",
              },
            });
          }
        }
      }
    }

    return createVisitors(context, {
      /** @param {Tag} node */
      Tag(node) {
        checkAttributes(node, node.name);
      },
      /** @param {ScriptTag} node */
      ScriptTag(node) {
        checkAttributes(node, "script");
      },
      /** @param {StyleTag} node */
      StyleTag(node) {
        checkAttributes(node, "style");
      },
    });
  },
};
