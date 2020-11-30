const { RULE_CATEGORY, ISO_639_1 } = require("../constants");
const { NodeUtils } = require("./utils");

const ISO_639_1_SET = new Set(ISO_639_1);

const MESSAGE_IDS = {
  MISSING_LANG: "missingLang",
  INVALID_LANG: "invalidLang",
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
      [MESSAGE_IDS.MISSING_LANG]: "Missing `lang` attribute at `<html>` tag",
      [MESSAGE_IDS.INVALID_LANG]: "Invalid value of `lang` attribute",
    },
  },

  create(context) {
    return {
      Html(node) {
        const langAttr = NodeUtils.findAttr(node, "lang");
        if (!langAttr) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.MISSING_LANG,
          });
        } else if (!ISO_639_1_SET.has(langAttr.value)) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.INVALID_LANG,
          });
        }
      },
    };
  },
};
