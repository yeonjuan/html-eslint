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
 * @typedef {Object} Option
 * @property {"widely" | "newly" | number} Option.available
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const { useBaseline, USE_BASELINE_MESSAGE_IDS } = require("@html-eslint/core");
const { elementNodeAdapter } = require("./utils/adapter");

/** @type {RuleModule<[Option]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Enforce the use of baseline features.",
      recommended: true,
      category: RULE_CATEGORY.BEST_PRACTICE,
      url: getRuleUrl("use-baseline"),
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          available: {
            anyOf: [
              {
                enum: ["widely", "newly"],
              },
              {
                // baseline year
                type: "integer",
                minimum: 2000,
                maximum: new Date().getFullYear(),
              },
            ],
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      [USE_BASELINE_MESSAGE_IDS.noBaselineElement]:
        "Element '{{element}}' is not a {{availability}} available baseline feature.",
      [USE_BASELINE_MESSAGE_IDS.notBaselineElementAttribute]:
        "Attribute '{{attr}}' on '{{element}}' is not a {{availability}} available baseline feature.",
      [USE_BASELINE_MESSAGE_IDS.notBaselineGlobalAttribute]:
        "Attribute '{{attr}}' is not a {{availability}} available baseline feature.",
    },
  },

  create(context) {
    const options = context.options[0] || { available: "widely" };
    const ruleCore = /**
     * @type {ReturnType<
     *   typeof useBaseline<
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
     */ (useBaseline(options));
    /** @param {Tag | ScriptTag | StyleTag} node */
    function check(node) {
      const adapter = elementNodeAdapter(node);
      const result = ruleCore.checkAttributes(adapter);

      for (const { messageId, data, node } of result) {
        context.report({
          node,
          messageId,
          data,
        });
      }
    }

    return createVisitors(context, {
      ScriptTag: check,
      StyleTag: check,
      Tag: check,
    });
  },
};
