/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const {
  noDuplicateClass,
  NO_DUPLICATE_CLASS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createAttributeValueAdapter } = require("../adapters/factory");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallow duplicate class names",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("no-duplicate-class"),
    },
    fixable: "code",
    schema: [],
    messages: {
      [NO_DUPLICATE_CLASS_MESSAGE_IDS.duplicateClass]:
        "The class '{{className}}' is duplicated.",
    },
  },

  create(context) {
    const { checkClassValue } = noDuplicateClass();

    return createVisitors(context, {
      Attribute(node) {
        if (node.key.value.toLowerCase() !== "class" || !node.value) {
          return;
        }

        const adapter = createAttributeValueAdapter(node.value);
        const result = checkClassValue(adapter);

        for (const { loc, messageId, range, data } of result) {
          context.report({
            loc,
            messageId,
            data,
            fix(fixer) {
              return fixer.removeRange(range);
            },
          });
        }
      },
    });
  },
};
