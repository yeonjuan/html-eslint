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
  noInvalidAttrValue,
  NO_INVALID_ATTR_VALUE_MESSAGE_IDS,
} = require("@html-eslint/core");
const { elementNodeAdapter } = require("./utils/adapter");

/**
 * @type {RuleModule<
 *   [{ allow?: { tag: string; attr: string; valuePattern?: string }[] }]
 * >}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        "Disallow invalid attribute values according to HTML standards",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-invalid-attr-value"),
    },

    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          allow: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tag: {
                  type: "string",
                },
                attr: {
                  type: "string",
                },
                valuePattern: {
                  type: "string",
                },
              },
              required: ["tag", "attr"],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [NO_INVALID_ATTR_VALUE_MESSAGE_IDS.invalid]:
        "Invalid value '{{value}}' for attribute '{{attr}}' on <{{element}}>. {{suggestion}}",
    },
  },

  create(context) {
    const options = context.options[0] || {};

    const ruleCore = /**
     * @type {ReturnType<
     *   typeof noInvalidAttrValue<
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
     */ (noInvalidAttrValue(options));

    /** @param {Tag | ScriptTag | StyleTag} node */
    function checkAttributes(node) {
      const result = ruleCore.checkAttributes(elementNodeAdapter(node));
      for (const r of result) {
        context.report({
          node: r.node,
          messageId: r.messageId,
          data: r.data,
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
