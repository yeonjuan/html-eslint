/**
 * @import {
 *   AngularElement,
 *   AngularTextAttribute,
 *   RuleModule
 * } from "../types"
 */

const {
  classSpacing,
  CLASS_SPACING_MESSAGE_IDS,
} = require("@html-eslint/core");
const {
  createAttributeValueAdapter,
} = require("../adapters/attribute-value/factory");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "Disallow extra spacing in class attribute values",
      recommended: true,
      category: "Stylistic Issues",
      url: "https://html-eslint.org/docs/angular-template/rules/class-spacing",
    },
    fixable: "code",
    schema: [],
    messages: {
      [CLASS_SPACING_MESSAGE_IDS.extraSpacing]:
        "Unexpected extra spacing in class attribute value",
    },
  },

  create(context) {
    const ruleCore = classSpacing();

    return {
      TextAttribute(node) {
        if (node.name !== "class") {
          return;
        }
        const adapter = createAttributeValueAdapter(node);
        const result = ruleCore.checkClassValue(adapter);
        for (const { loc, messageId, range } of result) {
          context.report({
            loc,
            messageId,
            fix(fixer) {
              return fixer.removeRange(range);
            },
          });
        }
      },
    };
  },
};
