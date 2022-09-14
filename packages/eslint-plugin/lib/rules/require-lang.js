/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSING: "missing",
  EMPTY: "empty",
};

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
    return {
      Tag(node) {
        if (node.name !== "html") {
          return;
        }
        const langAttr = NodeUtils.findAttr(node, "lang");
        if (!langAttr) {
          context.report({
            node: {
              loc: {
                start: node.openStart.loc.start,
                end: node.openEnd.loc.end,
              },
              range: [node.openStart.range[0], node.openEnd.range[1]],
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
    };
  },
};
