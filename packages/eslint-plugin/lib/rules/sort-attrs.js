/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {import("es-html-parser").TagNode} TagNode
 * @typedef {import("es-html-parser").TextNode} TextNode
 */
const { RULE_CATEGORY } = require("../constants");

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "layout",

    docs: {
      description: "Enforce attributes alphabetical sorting",
      category: RULE_CATEGORY.SEO,
      recommended: true,
    },

    fixable: "code",
    schema: [],
    messages: {},
  },
  create(context) {
    return {};
  },
};
