/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const {
  classSpacing,
  CLASS_SPACING_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createAttributeValueAdapter } = require("../adapters/factory");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "Disallow extra spacing in class attribute values",
      recommended: false,
      category: RULE_CATEGORY.STYLE,
      url: getRuleUrl("class-spacing"),
    },
    fixable: "code",
    schema: [],
    messages: {
      [CLASS_SPACING_MESSAGE_IDS.extraSpacing]:
        "Unexpected space at the start of class attribute value",
    },
  },

  create(context) {
    const { checkClassValue } = classSpacing();
    return createVisitors(context, {
      Attribute(node) {
        if (node.key.value.toLowerCase() !== "class" || !node.value) {
          return;
        }

        const adapter = createAttributeValueAdapter(node.value);
        const result = checkClassValue(adapter);
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
    });
  },
};
