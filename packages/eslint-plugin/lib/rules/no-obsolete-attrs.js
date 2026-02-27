/**
 * @import {
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const {
  noObsoleteAttrs,
  NO_OBSOLETE_ATTRS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const { elementNodeAdapter } = require("./utils/adapter");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow use of obsolete attributes in HTML5",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
      url: getRuleUrl("no-obsolete-attrs"),
    },

    fixable: null,
    schema: [],
    messages: {
      [NO_OBSOLETE_ATTRS_MESSAGE_IDS.obsolete]:
        "The {{attr}} attribute on <{{element}}> is obsolete. {{suggestion}}",
    },
  },

  create(context) {
    const ruleCore = noObsoleteAttrs();

    /** @param {Tag | ScriptTag | StyleTag} node */
    function checkObsoleteAttrs(node) {
      const adapter = elementNodeAdapter(node);
      const result = ruleCore.checkAttributes(adapter);
      for (const { node, messageId, data } of result) {
        context.report({
          node,
          messageId,
          data,
        });
      }
    }

    return createVisitors(context, {
      Tag: checkObsoleteAttrs,
      ScriptTag: checkObsoleteAttrs,
      StyleTag: checkObsoleteAttrs,
    });
  },
};
