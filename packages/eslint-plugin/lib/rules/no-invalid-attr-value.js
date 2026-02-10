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

/** @type {RuleModule<[]>} */
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
    schema: [],
    messages: {
      [MESSAGE_IDS.INVALID]:
        "Invalid value '{{value}}' for attribute '{{attr}}' on <{{element}}>. {{suggestion}}",
    },
  },

  create(context) {
    /**
     * @param {Tag | ScriptTag | StyleTag} node
     * @param {string} elementName
     */
    function checkAttributes(node, elementName) {
      for (const attr of node.attributes) {
        const key = attr.key.value;
        if (key.toLowerCase() === "rel") {
          continue;
        }

        const value = attr.value ? attr.value.value : "";
        if (attr.value && hasTemplate(attr.value)) {
          continue;
        }
        const validator = element(elementName).attributes.get(key);
        if (validator) {
          const result = validator.validate(value);
          if (!result.valid) {
            context.report({
              node: attr,
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
