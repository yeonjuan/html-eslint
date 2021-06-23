/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSING_ATTRS: "missingAttrs",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Avoid unset required attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          exceptStrings: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    ],
    messages: {
      [MESSAGE_IDS.MISSING_ATTRS]: "Some attributes {{terms}} are missing.",
    },
  },

  create(context) {
    const { exceptString } = context.options[0] || ["translate", "notranslate"];
    const regex = /\{\{.*[a-zA-Z]*\}\}/i; // {{ handlebars }}
    return {
      "*"(node) {
        if (
          NodeUtils.isTextNode(node) &&
          node.value.trim() &&
          // @ts-ignore
          Array.isArray(node.parent.attrs) &&
          !regex.test(node.value)
        ) {
          // @ts-ignore
          const exceptStringIsPresent = (node.parent.attrs || []).find(
            (attr) => {
              return exceptString.includes(attr.name.toLowerCase());
            }
          );
          if (!exceptStringIsPresent) {
            context.report({
              node,
              data: { terms: exceptString.join(", ") },
              messageId: MESSAGE_IDS.MISSING_ATTRS,
            });
          }
        }
      },
    };
  },
};
