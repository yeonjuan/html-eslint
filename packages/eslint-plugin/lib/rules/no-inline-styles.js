/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");
const { NODE_TYPES } = require("@html-eslint/parser");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  INLINE_STYLE: "unexpectedInlineStyle",
};

/** @type {RuleModule<[{ allowExpressions: boolean }]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow using inline style",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-inline-styles"),
    },

    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          allowExpressions: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.INLINE_STYLE]: "Unexpected usage of inline style",
    },
  },

  create(context) {
    const { allowExpressions = false } = context.options[0] || {};

    return createVisitors(context, {
      Tag(node) {
        const styleAttr = findAttr(node, "style");
        if (!styleAttr) return;

        if (
          allowExpressions &&
          styleAttr.value?.parts.some(
            (part) => part.type === NODE_TYPES.Template
          )
        ) {
          return;
        }

        context.report({
          node: styleAttr,
          messageId: MESSAGE_IDS.INLINE_STYLE,
        });
      },
    });
  },
};
