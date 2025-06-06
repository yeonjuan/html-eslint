/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 *
 * @typedef {Object} Option
 * @property {string[]} [substitute]
 *
 * @typedef { import("../types").RuleModule<[Option]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MISSING_ALT: "missingAlt",
  EMPTY_ALT: "emptyAlt",
  INSERT_ALT: "insertAlt",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description:
        "Require `alt` attribute with non-empty value at `<img>` tag",
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
      },
    ],
    messages: {
      [MESSAGE_IDS.MISSING_ALT]: "Missing `alt` attribute at `<img>` tag",
      [MESSAGE_IDS.EMPTY_ALT]: "Empty `alt` attribute at `<img>` tag",
      [MESSAGE_IDS.INSERT_ALT]: 'Insert `alt=""` attribute with description',
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

        const altResult = hasValidAltOrSubstitute(node, substitute);
        const hasSubstituteOption = substitute.length > 0;

        if (!altResult.hasAnyAlt) {
          if (hasSubstituteOption) {
            context.report({
              loc: {
                start: node.openStart.loc.start,
                end: node.openEnd.loc.end,
              },
              messageId: MESSAGE_IDS.MISSING_ALT,
            });
          } else {
            context.report({
              loc: {
                start: node.openStart.loc.start,
                end: node.openEnd.loc.end,
              },
              messageId: MESSAGE_IDS.MISSING_ALT,
              suggest: [
                {
                  messageId: MESSAGE_IDS.INSERT_ALT,
                  fix(fixer) {
                    return fixer.insertTextBefore(node.openEnd, ' alt=""');
                  },
                },
              ],
            });
          }
        } else if (altResult.hasEmptyAlt && !altResult.hasValidContent) {
          if (hasSubstituteOption) {
            context.report({
              loc: {
                start: node.openStart.loc.start,
                end: node.openEnd.loc.end,
              },
              messageId: MESSAGE_IDS.EMPTY_ALT,
            });
          } else {
            context.report({
              loc: {
                start: node.openStart.loc.start,
                end: node.openEnd.loc.end,
              },
              messageId: MESSAGE_IDS.EMPTY_ALT,
              suggest: [
                {
                  messageId: MESSAGE_IDS.INSERT_ALT,
                  fix(fixer) {
                    const emptyAltAttr = node.attributes.find(
                      (attr) =>
                        attr.key &&
                        attr.key.value === "alt" &&
                        (!attr.value ||
                          !attr.value.value ||
                          attr.value.value.trim() === "")
                    );
                    if (emptyAltAttr && emptyAltAttr.value) {
                      return fixer.replaceText(emptyAltAttr.value, '""');
                    }
                    return null;
                  },
                },
              ],
            });
          }
        }
      },
    });
  },
};

/**
 * @param {Tag} node
 * @param {string[]} substitute
 * @returns {{hasAnyAlt: boolean, hasEmptyAlt: boolean, hasValidContent: boolean}}
 */
function hasValidAltOrSubstitute(node, substitute = []) {
  let hasAnyAlt = false;
  let hasEmptyAlt = false;
  let hasValidContent = false;

  for (const attr of node.attributes) {
    if (attr.key && attr.key.value) {
      const isAltAttr = attr.key.value === "alt";
      const isSubstituteAttr = substitute.includes(attr.key.value);

      if (isAltAttr || isSubstituteAttr) {
        hasAnyAlt = true;

        if (
          attr.value &&
          typeof attr.value.value === "string" &&
          attr.value.value.trim() !== ""
        ) {
          hasValidContent = true;
        } else if (isAltAttr && attr.value !== null) {
          hasEmptyAlt = false;
        }
      }
    }
  }

  return {
    hasAnyAlt,
    hasEmptyAlt,
    hasValidContent,
  };
}
