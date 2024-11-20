/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").RuleListener } RuleListener
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { parse } = require("@html-eslint/template-parser");
const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./utils/settings");
const { getSourceCode } = require("./utils/source-code");
const MESSAGE_IDS = {
  INLINE_STYLE: "unexpectedInlineStyle",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow using inline style",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.INLINE_STYLE]: "Unexpected usage of inline style",
    },
  },

  create(context) {
    /**
     * @type {RuleListener}
     */
    const visitors = {
      Tag(node) {
        const styleAttr = findAttr(node, "style");
        if (styleAttr) {
          context.report({
            node: styleAttr,
            messageId: MESSAGE_IDS.INLINE_STYLE,
          });
        }
      },
    };

    return {
      ...visitors,
      TaggedTemplateExpression(node) {
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          parse(node.quasi, getSourceCode(context), visitors);
        }
      },
      TemplateLiteral(node) {
        if (shouldCheckTemplateLiteral(node, context)) {
          parse(node, getSourceCode(context), visitors);
        }
      },
    };
  },
};
