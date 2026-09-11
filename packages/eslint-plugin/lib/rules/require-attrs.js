/**
 * @import {RequireAttrsOptions} from "@html-eslint/core"
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
  requireAttrs,
  REQUIRE_ATTRS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createElementAdapter } = require("../adapters/factory");

/** @type {RuleModule<RequireAttrsOptions>} */
module.exports = {
  meta: {
    type: "problem",

    docs: {
      description: "Require specified attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("require-attrs"),
    },
    fixable: "code",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tag: { type: "string" },
          attr: { type: "string" },
          value: { type: "string" },
          message: { type: "string" },
          conditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                attr: { type: "string" },
                value: { type: "string" },
                kind: {
                  enum: ["present", "absent", "equal", "not-equal"],
                },
              },
              required: ["attr", "kind"],
              additionalProperties: false,
            },
          },
        },
        required: ["tag", "attr"],
        additionalProperties: false,
      },
    },
    messages: {
      [REQUIRE_ATTRS_MESSAGE_IDS.missing]:
        "Missing '{{attr}}' attribute on '{{tag}}' tag",
      [REQUIRE_ATTRS_MESSAGE_IDS.unexpected]:
        "Unexpected '{{attr}}' attribute value. '{{expected}}' is expected",
    },
  },

  create(context) {
    const { checkElement } = requireAttrs(context.options || []);

    /** @param {Tag | StyleTag | ScriptTag} node */
    function check(node) {
      const adapter = createElementAdapter(node);
      const result = checkElement(adapter);
      for (const item of result) {
        context.report({
          loc: item.loc,
          ...("messageId" in item
            ? { messageId: item.messageId }
            : { message: item.message }),
          data: item.data,
          fix: item.fix
            ? (
                (fix) => (fixer) =>
                  fixer.replaceTextRange(fix.range, fix.text)
              )(item.fix)
            : null,
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
