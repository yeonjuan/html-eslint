/**
 * @typedef {import("../types").ElementNode} ElementNode
 * @typedef {import("../types").Context} Context
 */

const { RULE_CATEGORY, NODE_TYPES } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSING: "missing",
  EMPTY: "empty",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: 'Require use of `<meta name="description">` in `<head>`',
      category: RULE_CATEGORY.SEO,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: 'Missing `<meta name="description">`.',
      [MESSAGE_IDS.EMPTY]:
        'Unexpected empty `content` in `<meta name="description">`',
    },
  },

  /**
   * @param {Context} context
   */
  create(context) {
    return {
      /**
       * @param {ElementNode} node
       */
      Head(node) {
        const metaTags = (node.childNodes || []).filter(
          (child) => child.type === NODE_TYPES.META
        );
        const descriptionMetaTags = metaTags.filter((meta) => {
          const nameAttr = NodeUtils.findAttr(meta, "name");
          return !!nameAttr && nameAttr.value.toLowerCase() === "description";
        });

        if (descriptionMetaTags.length === 0) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING,
          });
        } else {
          descriptionMetaTags.forEach((meta) => {
            const content = NodeUtils.findAttr(meta, "content");
            if (!content || !content.value.trim().length) {
              context.report({
                node: content || meta,
                messageId: MESSAGE_IDS.EMPTY,
              });
            }
          });
        }
      },
    };
  },
};
