/**
 * @import {
 *   AttributeKey,
 *   AttributeValue,
 *   ScriptTag,
 *   StyleTag,
 *   Tag
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const { noInvalidAttrValue } = require("@html-eslint/core");
const { elementNodeAdapter } = require("./utils/adapter");

const MESSAGE_IDS = {
  INVALID: "invalid",
};

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
      [MESSAGE_IDS.INVALID]:
        "Invalid value '{{value}}' for attribute '{{attr}}' on <{{element}}>. {{suggestion}}",
    },
  },

  create(context) {
    const options = context.options[0] || {};

    const ruleCore = /**
     * @type {ReturnType<
     *   typeof noInvalidAttrValue<AttributeKey, AttributeValue>
     * >}
     */ (noInvalidAttrValue(options));

    /** @param {Tag | ScriptTag | StyleTag} node */
    function checkAttributes(node) {
      const result = ruleCore.checkAttributes(elementNodeAdapter(node));
      for (const r of result) {
        context.report({
          node: r.valueNode || r.keyNode,
          messageId: MESSAGE_IDS.INVALID,
          data: {
            value: r.valueNode ? r.valueNode.value : "",
            attr: r.keyNode.value,
            element: r.elementName,
            suggestion: r.reason || "Use a valid value.",
          },
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
