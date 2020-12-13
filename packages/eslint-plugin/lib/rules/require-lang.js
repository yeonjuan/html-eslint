// @ts-check
const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSNG: "missing",
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
      [MESSAGE_IDS.MISSNG]: "Missing `lang` attribute in `<html>` tag.",
      [MESSAGE_IDS.EMPTY]: "Unexpected empty `lang` in in `<html>` tag.",
    },
  },

  create(context) {
    return {
      Html(node) {
        const langAttr = NodeUtils.findAttr(node, "lang");
        if (!langAttr) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.MISSNG,
          });
        } else if (langAttr.value.trim().length === 0) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.EMPTY,
          });
        }
      },
    };
  },
};
