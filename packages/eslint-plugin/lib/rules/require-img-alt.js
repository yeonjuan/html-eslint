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
  INSERT_EMPTY: "insertEmptyAlt",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "Require `alt` attribute at `<img>` tag",
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
      [MESSAGE_IDS.INSERT_EMPTY]: 'Insert empty `alt=""` attribute',
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

        if (!hasAltAttrAndValue(node, substitute)) {
          context.report({
            loc: {
              start: node.openStart.loc.start,
              end: node.openEnd.loc.end,
            },
            messageId: MESSAGE_IDS.MISSING_ALT,
            suggest: [
              {
                messageId: MESSAGE_IDS.INSERT_EMPTY,
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
 */
function hasAltAttrAndValue(node, substitute = []) {
  return node.attributes.some((attr) => {
    if (attr.key && attr.value) {
      return (
        (attr.key.value === "alt" || substitute.includes(attr.key.value)) &&
        typeof attr.value.value === "string"
      );
    }
    return false;
  });
}
