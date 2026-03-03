/** @import {RuleModule} from "../types" */
const {
  noObsoleteAttrs,
  NO_OBSOLETE_ATTRS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { createElementAdapter } = require("../adapters/element/factory");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow use of obsolete attributes in HTML5",
      category: "Best Practice",
      recommended: true,
      url: "https://html-eslint.org/docs/angular-template/rules/no-obsolete-attrs",
    },
    fixable: null,
    schema: [],
    messages: {
      [NO_OBSOLETE_ATTRS_MESSAGE_IDS.obsolete]:
        "The {{attr}} attribute on <{{element}}> is obsolete. {{suggestion}}",
    },
  },

  create(context) {
    const { checkAttributes } = noObsoleteAttrs();

    return {
      Element(node) {
        if (node.name.includes("-")) {
          return;
        }
        const adapter = createElementAdapter(node);
        const result = checkAttributes(adapter);
        for (const { loc, messageId, data } of result) {
          context.report({
            loc,
            messageId,
            data,
          });
        }
      },
    };
  },
};
