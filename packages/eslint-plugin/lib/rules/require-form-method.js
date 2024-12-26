/**
 * @typedef { import("../types").RuleModule } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  MISSING: "missing",
  MISSING_VALUE: "missingValue",
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
      [MESSAGE_IDS.MISSING]: "The 'method' attribute is missing on the <form>.",
      [MESSAGE_IDS.MISSING_VALUE]:
        "The 'method' attribute value is missing on the <form>",
      [MESSAGE_IDS.UNEXPECTED]:
        "The 'method' attribute has an invalid value on the <form>.",
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
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.MISSING_VALUE,
          });
          return;
        }

        if (
          method.value.templates &&
          method.value.templates.some((template) => template.isTemplate)
        ) {
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
