/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 * @typedef { import("@html-eslint/types").AttributeValue } AttributeValue
 * @typedef { import("../types").SuggestionReportDescriptor } SuggestionReportDescriptor
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  MISSING: "missing",
  INVALID: "invalid",
  REPLACE_TO_SUBMIT: "replaceToSubmit",
  REPLACE_TO_BUTTON: "replaceToButton",
  REPLACE_TO_RESET: "replaceToReset",
};

const VALID_BUTTON_TYPES_SET = new Set(["submit", "button", "reset"]);

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require use of button element with a valid type attribute.",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: true,
    hasSuggestions: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing a type attribute for button",
      [MESSAGE_IDS.INVALID]:
        '"{{type}}" is an invalid value for button type attribute.',
      [MESSAGE_IDS.REPLACE_TO_BUTTON]: "Replace the type with 'button'",
      [MESSAGE_IDS.REPLACE_TO_SUBMIT]: "Replace the type with 'submit'",
      [MESSAGE_IDS.REPLACE_TO_RESET]: "Replace the type with 'reset'",
    },
  },

  create(context) {
    /**
     * @param {AttributeValue} node
     * @returns {SuggestionReportDescriptor[]}
     */
    function getSuggestions(node) {
      return [
        {
          messageId: MESSAGE_IDS.REPLACE_TO_SUBMIT,
          fix: (fixer) => fixer.replaceTextRange(node.range, "submit"),
        },
        {
          messageId: MESSAGE_IDS.REPLACE_TO_BUTTON,
          fix: (fixer) => fixer.replaceTextRange(node.range, "button"),
        },
        {
          messageId: MESSAGE_IDS.REPLACE_TO_RESET,
          fix: (fixer) => fixer.replaceTextRange(node.range, "reset"),
        },
      ];
    }

    return createVisitors(context, {
      Tag(node) {
        if (node.name !== "button") {
          return;
        }
        const typeAttr = findAttr(node, "type");
        if (!typeAttr || !typeAttr.value) {
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.MISSING,
            fix(fixer) {
              return fixer.insertTextAfter(node.openStart, ' type="submit"');
            },
          });
        } else if (
          !VALID_BUTTON_TYPES_SET.has(typeAttr.value.value) &&
          !typeAttr.value.parts.length
        ) {
          context.report({
            node: typeAttr,
            messageId: MESSAGE_IDS.INVALID,
            data: {
              type: typeAttr.value.value,
            },
            suggest: getSuggestions(typeAttr.value),
          });
        }
      },
    });
  },
};
