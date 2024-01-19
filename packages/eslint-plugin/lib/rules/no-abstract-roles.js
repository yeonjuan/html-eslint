/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").StyleTagNode } StyleTagNode
 * @typedef { import("../types").ScriptTagNode } ScriptTagNode
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");

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
    return {
      /**
       *
       * @param {TagNode | ScriptTagNode | StyleTagNode} node
       */
      [["Tag", "ScriptTag", "StyleTag"].join(",")](node) {
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
      },
    };
  },
};
