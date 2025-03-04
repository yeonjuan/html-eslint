/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  UNNECESSARY: "unnecessary",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        "Enforce to omit type attributes for style sheets and scripts",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: "code",
    schema: [],
    messages: {
      [MESSAGE_IDS.UNNECESSARY]: "Unnecessary type attributes",
    },
  },

  create(context) {
    /**
     *
     * @param {ScriptTag | Tag | StyleTag} node
     * @param {string} unnecessaryValue
     */
    function check(node, unnecessaryValue) {
      const type = findAttr(node, "type");
      if (
        type &&
        type.value &&
        type.value.value &&
        type.value.value.trim().toLocaleLowerCase() === unnecessaryValue
      ) {
        context.report({
          node: type,
          messageId: MESSAGE_IDS.UNNECESSARY,
          fix(fixer) {
            return fixer.remove(type);
          },
        });
      }
    }
    return createVisitors(context, {
      ScriptTag(node) {
        check(node, "text/javascript");
      },
      StyleTag(node) {
        check(node, "text/css");
      },
      Tag(node) {
        if (node.name === "link") {
          const rel = findAttr(node, "rel");
          if (rel && rel.value && rel.value.value === "stylesheet") {
            check(node, "text/css");
          }
        }
      },
    });
  },
};
