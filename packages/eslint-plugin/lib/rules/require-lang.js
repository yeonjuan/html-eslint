/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

 /**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");
const IOS_639_1 = require("../constants/iso_639_1");

const MESSAGE_IDS = {
  MISSING_LANG: "missingLang",
  INVALID_LANG: "invalidLang",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "require `lang` attribute at `<html>` tag",
      category: CATEGORY.SEO,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING_LANG]: "missing `lang` attribute at `<html>` tag",
      [MESSAGE_IDS.INVALID_LANG]: "invalid value of `lang` attribute",
    },
  },

  create(context) {
    return {
      html(node) {
        const attrs = node.attrs || [];
        const langAttr = attrs.find(isLangAttribute);
        if (!langAttr) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.MISSING_LANG,
          });
        } else if (!IOS_639_1.includes(langAttr.value)) {
          context.report({
            node: node.startTag,
            messageId: MESSAGE_IDS.INVALID_LANG,
          });
        }
      },
    };
  },
};

function isLangAttribute(attr) {
  return attr.name === "lang";
}
