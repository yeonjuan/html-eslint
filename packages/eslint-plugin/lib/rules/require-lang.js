/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  MISSING: "missing",
  EMPTY: "empty",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `lang` attribute at `<html>` tag",
      category: RULE_CATEGORY.SEO,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing `lang` attribute in `<html>` tag.",
      [MESSAGE_IDS.EMPTY]: "Unexpected empty `lang` in in `<html>` tag.",
    },
  },

  create(context) {
    return createVisitors(context, {
      Tag(node) {
        if (node.name !== "html") {
          return;
        }
        const langAttr = findAttr(node, "lang");
        if (!langAttr) {
          context.report({
            loc: {
              start: node.openStart.loc.start,
              end: node.openEnd.loc.end,
            },
            messageId: MESSAGE_IDS.MISSING,
          });
        } else if (langAttr.value && langAttr.value.value.trim().length === 0) {
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.EMPTY,
          });
        }
      },
    });
  },
};
