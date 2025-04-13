/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("@html-eslint/types").AttributeValue } AttributeValue
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 * @typedef {Object} ClassInfo
 * @property {string} name
 * @property {import("@html-eslint/types").AnyNode['loc']} loc
 * @property {import("@html-eslint/types").AnyNode['range']} range
 */

const { parse } = require("@html-eslint/template-parser");
const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./utils/settings");
const { getSourceCode } = require("./utils/source-code");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  DUPLICATE_CLASS: "duplicateClass",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use duplicate class",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_CLASS]: "The class '{{class}}' is duplicated.",
    },
  },

  create(context) {
    /**
     * @param {AttributeValue} value
     * @returns {string[]}
     */
    function getClasses(value) {
      const splitted = value.value.split("/s+/");
      return;
    }

    return createVisitors(context, {
      Attribute(node) {
        if (node.key.value.toLowerCase() !== "class") {
          return;
        }
        if (!node.value || !node.value.value) {
          return;
        }
      },
    });
  },
};
