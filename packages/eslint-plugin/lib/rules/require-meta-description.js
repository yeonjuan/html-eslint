/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {import("es-html-parser").TagNode} TagNode
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSING: "missing",
  EMPTY: "empty",
};

/**
 * @param {TagNode['children'][number]} node
 * @returns {boolean}
 */
function isMetaTagNode(node) {
  return node.type === "Tag" && node.name === "meta";
}

/**
 * @type {Rule}
 */
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
  create(context) {
    return {
      Tag(node) {
        if (node.name !== "head") {
          return;
        }
        const metaTags = node.children.filter(isMetaTagNode);

        const descriptionMetaTags = metaTags.filter((meta) => {
          const nameAttr = NodeUtils.findAttr(meta, "name");
          return (
            !!nameAttr &&
            nameAttr.value &&
            nameAttr.value.value.toLowerCase() === "description"
          );
        });

        if (descriptionMetaTags.length === 0) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING,
          });
        } else {
          descriptionMetaTags.forEach((meta) => {
            const content = NodeUtils.findAttr(meta, "content");
            if (
              !content ||
              !content.value ||
              !content.value.value.trim().length
            ) {
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
