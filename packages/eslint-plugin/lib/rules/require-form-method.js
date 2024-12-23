/**
 * @typedef { import("../types").RuleModule } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  MISSING: "missing",
  UNEXPECTED: "unexpected",
};

const ALLOWED_METHODS = new Set(["GET", "POST", "DIALOG"]);

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `title` in `<frame>`, `<iframe>`",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: false,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing `method` attribute in <form>.",
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected `method`",
    },
  },

  create(context) {
    return createVisitors(context, {
      Tag(node) {
        if (node.name.toLowerCase() !== "form") {
          return;
        }
        const method = findAttr(node, "method");

        if (!method) {
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.MISSING,
          });
          return;
        }

        if (!method.value) {
          return;
        }

        if (!ALLOWED_METHODS.has(method.value.value.toUpperCase())) {
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    });
  },
};
