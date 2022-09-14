/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

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
 * @type {Rule}
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
      [["Tag", "ScriptTag", "StyleTag"].join(",")](node) {
        const roleAttr = NodeUtils.findAttr(node, "role");
        if (roleAttr) {
          if (roleAttr.value && ABSTRACT_ROLE_SET.has(roleAttr.value.value)) {
            context.report({
              messageId: MESSAGE_IDS.UNEXPECTED,
              node: roleAttr,
            });
          }
        }
      },
    };
  },
};
