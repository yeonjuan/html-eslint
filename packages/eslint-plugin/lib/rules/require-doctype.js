/**
 * @import {RuleModule} from "../types";
 */

const { RULE_CATEGORY } = require("../constants");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MISSING: "missing",
};

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `<!DOCTYPE HTML>` in HTML",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
      url: getRuleUrl("require-doctype"),
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
      Tag(node) {
        if (node.name !== "html") {
          return;
        }
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
