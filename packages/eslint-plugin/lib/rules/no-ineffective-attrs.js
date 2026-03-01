/**
 * @import {
 *   AttributeKey,
 *   AttributeValue,
 *   OpenScriptTagStart,
 *   OpenStyleTagStart,
 *   OpenTagStart,
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
  noIneffectiveAttrs,
  NO_INEFFECTIVE_ATTRS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { elementNodeAdapter } = require("./utils/adapter");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow HTML attributes that have no effect in their context",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-ineffective-attrs"),
    },
    fixable: null,
    schema: [],
    messages: {
      [NO_INEFFECTIVE_ATTRS_MESSAGE_IDS.ineffective]: "{{ message }}",
    },
  },

  create(context) {
    const ruleCore = /**
     * @type {ReturnType<
     *   typeof noIneffectiveAttrs<
     *     | Tag
     *     | ScriptTag
     *     | StyleTag
     *     | OpenTagStart
     *     | OpenScriptTagStart
     *     | OpenStyleTagStart,
     *     AttributeKey,
     *     AttributeValue
     *   >
     * >}
     */ (noIneffectiveAttrs());

    /** @param {Tag | ScriptTag | StyleTag} node */
    function checkAttributes(node) {
      const result = ruleCore.checkAttributes(elementNodeAdapter(node));
      for (const { node, messageId, data } of result) {
        context.report({
          node,
          messageId,
          data,
        });
      }
    }

    return createVisitors(context, {
      Tag: checkAttributes,
      ScriptTag: checkAttributes,
      StyleTag: checkAttributes,
    });
  },
};
