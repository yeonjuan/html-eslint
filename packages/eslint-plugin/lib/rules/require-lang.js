/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

/**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");
const IOS_639_1 = require("../constants/iso_639_1");
const utils = require("./utils");

const MESSAGE_IDS = {
  MISSING_LANG: "missingLang",
  INVALID_LANG: "invalidLang",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `lang` attribute at `<html>` tag",
      category: CATEGORY.SEO,
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
        const langAttr = utils.findAttr(node, "lang");
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
