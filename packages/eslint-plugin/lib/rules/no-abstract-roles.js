/**
 * @import {Tag, StyleTag, ScriptTag} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

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
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow use of abstract roles",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
      url: getRuleUrl("no-abstract-roles"),
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
