/**
 * @import {
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const { elementNodeAdapter } = require("./utils/adapter");
const {
  noObsoleteTags,
  NO_OBSOLETE_TAGS_MESSAGE_IDS,
} = require("@html-eslint/core");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow use of obsolete elements in HTML5",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
      url: getRuleUrl("no-obsolete-tags"),
    },

    fixable: null,
    schema: [],
    messages: {
      [NO_OBSOLETE_TAGS_MESSAGE_IDS.unexpected]:
        "Unexpected use of obsolete tag <{{tag}}>",
    },
  },

  create(context) {
    const ruleCore = noObsoleteTags();

    /** @param {Tag | ScriptTag | StyleTag} node */
    function checkElement(node) {
      const result = ruleCore.checkElement(elementNodeAdapter(node));
      for (const r of result) {
        context.report({
          node: r.node,
          messageId: r.messageId,
          data: r.data,
        });
      }
    }

    return createVisitors(context, {
      Tag: checkElement,
      ScriptTag: checkElement,
      StyleTag: checkElement,
    });
  },
};
