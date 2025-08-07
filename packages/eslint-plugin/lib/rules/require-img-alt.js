/**
 * @import {Tag} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 *
 * @typedef {Object} Option
 * @property {string[]} [substitute]
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MISSING_ALT: "missingAlt",
  INSERT_ALT: "insertAlt",
};

/**
 * @type {RuleModule<[Option]>}
 */
module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "Require `alt` attribute on `<img>` tag",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: true,
      url: getRuleUrl("require-img-alt"),
    },

    fixable: null,
    hasSuggestions: true,
    schema: [
      {
        type: "object",
        properties: {
          substitute: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.MISSING_ALT]: "Missing `alt` attribute at `<img>` tag",
      [MESSAGE_IDS.INSERT_ALT]: 'Insert `alt=""` at `<img>` tag',
    },
  },

  create(context) {
    const substitute =
      (context.options &&
        context.options[0] &&
        context.options[0].substitute) ||
      [];

    return createVisitors(context, {
      Tag(node) {
        if (node.name !== "img") {
          return;
        }

        const hasAlt = hasValidAltOrSubstitute(node, substitute);
        const hasSubstituteOption = substitute.length > 0;

        if (!hasAlt) {
          context.report({
            loc: {
              start: node.openStart.loc.start,
              end: node.openEnd.loc.end,
            },
            messageId: MESSAGE_IDS.MISSING_ALT,
            suggest: hasSubstituteOption
              ? null
              : [
                  {
                    messageId: MESSAGE_IDS.INSERT_ALT,
                    fix(fixer) {
                      return fixer.insertTextBefore(node.openEnd, ' alt=""');
                    },
                  },
                ],
          });
        }
      },
    });
  },
};

/**
 * @param {Tag} node
 * @param {string[]} substitute
 * @returns {boolean}
 */
function hasValidAltOrSubstitute(node, substitute) {
  let hasAnyAlt = false;

  for (const attr of node.attributes) {
    if (attr.key && attr.key.value) {
      const isAltAttr = attr.key.value === "alt";
      const isSubstituteAttr = substitute.includes(attr.key.value);

      if (isAltAttr || isSubstituteAttr) {
        hasAnyAlt = true;
        break;
      }
    }
  }

  return hasAnyAlt;
}
