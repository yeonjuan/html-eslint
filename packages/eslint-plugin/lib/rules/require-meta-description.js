/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").AnyNode } AnyNode
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */
const { RULE_CATEGORY } = require("../constants");
const { filter } = require("./utils/array");
const { findAttr, isTag } = require("./utils/node");

const MESSAGE_IDS = {
  MISSING: "missing",
  EMPTY: "empty",
};

/**
 * @param {AnyNode} node
 * @returns {node is Tag}
 */
function isMetaTagNode(node) {
  return isTag(node) && node.name === "meta";
}

/**
 * @type {RuleModule}
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
        const metaTags = filter(node.children, isMetaTagNode);

        const descriptionMetaTags = metaTags.filter((meta) => {
          const nameAttr = findAttr(meta, "name");
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
            const content = findAttr(meta, "content");
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
