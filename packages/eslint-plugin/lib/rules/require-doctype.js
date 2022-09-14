/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  MISSING: "missing",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `<!DOCTYPE HTML>` in html,",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing `<!DOCTYPE HTML>`",
    },
  },

  create(context) {
    let hasDocType = false;
    return {
      Doctype() {
        hasDocType = true;
      },
      "Program:exit"(node) {
        if (!hasDocType) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING,
            fix(fixer) {
              return fixer.insertTextBeforeRange([0, 0], "<!DOCTYPE html>\n");
            },
          });
        }
      },
    };
  },
};
