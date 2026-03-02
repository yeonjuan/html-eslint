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
const {
  noObsoleteTags,
  NO_OBSOLETE_TAGS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createElementAdapter } = require("../adapters/factory");

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
    const { checkElement } = noObsoleteTags();

    /** @param {Tag | ScriptTag | StyleTag} node */
    function check(node) {
      const adapter = createElementAdapter(node);
      const result = checkElement(adapter);
      for (const { loc, messageId, data } of result) {
        context.report({
          loc,
          messageId,
          data,
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
