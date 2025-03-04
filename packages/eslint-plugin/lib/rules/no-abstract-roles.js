/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

const ABSTRACT_ROLE_SET = new Set([
  "command",
  "composite",
  "input",
  "landmark",
  "range",
  "roletype",
  "section",
  "sectionhead",
  "select",
  "structure",
  "widget",
  "window",
]);

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use of abstract roles",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected use of an abstract role.",
    },
  },

  create(context) {
    /**
     * @param {Tag | ScriptTag | StyleTag} node
     */
    function check(node) {
      const roleAttr = findAttr(node, "role");
      if (
        roleAttr &&
        roleAttr.value &&
        ABSTRACT_ROLE_SET.has(roleAttr.value.value)
      ) {
        context.report({
          messageId: MESSAGE_IDS.UNEXPECTED,
          node: roleAttr,
        });
      }
    }

    return createVisitors(context, {
      Tag: check,
      ScriptTag: check,
      StyleTag: check,
    });
  },
};
