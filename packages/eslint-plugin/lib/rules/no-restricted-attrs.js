/**
 * @import {NoRestrictedAttrsOptions} from "@html-eslint/core"
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
  noRestrictedAttrs,
  NO_RESTRICTED_ATTRS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createElementAdapter } = require("../adapters/factory");

/** @type {RuleModule<NoRestrictedAttrsOptions>} */
module.exports = {
  meta: {
    type: "problem",

    docs: {
      description: "Disallow specified attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-restricted-attrs"),
    },

    fixable: null,
    schema: {
      type: "array",

      items: {
        type: "object",
        required: ["tagPatterns", "attrPatterns"],
        properties: {
          tagPatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
          attrPatterns: {
            type: "array",
            items: {
              type: "string",
            },
          },
          message: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    },
    messages: {
      [NO_RESTRICTED_ATTRS_MESSAGE_IDS.restricted]:
        "'{{attr}}' is restricted from being used.",
    },
  },

  create(context) {
    const { checkAttributes } = noRestrictedAttrs(context.options);

    /** @param {Tag | StyleTag | ScriptTag} node */
    function check(node) {
      const adapter = createElementAdapter(node);
      const result = checkAttributes(adapter);
      for (const item of result) {
        context.report({
          loc: item.loc,
          ...("messageId" in item
            ? { messageId: item.messageId }
            : { message: item.message }),
          data: item.data,
        });
      }
    }

    return createVisitors(context, {
      Tag: check,
      StyleTag: check,
      ScriptTag: check,
    });
  },
};
