/**
 * @import {
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
const { createElementAdapter } = require("../adapters/factory");

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
    const { checkAttributes } = useBaseline(options);
    /** @param {Tag | ScriptTag | StyleTag} node */
    function check(node) {
      const adapter = createElementAdapter(node);
      const result = checkAttributes(adapter);

      for (const { messageId, data, loc } of result) {
        context.report({
          loc,
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
