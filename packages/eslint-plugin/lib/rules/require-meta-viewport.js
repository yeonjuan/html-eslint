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
 * Checks whether a given node is a meta tag with viewport attribute or not.
 * @param {TagNode['children'][number]} node A node to check
 * @returns {node is TagNode} Return true if the given node is a meta tag with viewport attribute, otherwise false.
 */
function isMetaViewport(node) {
  if (node.type === "Tag" && node.name === "meta") {
    const nameAttribute = NodeUtils.findAttr(node, "name");
    return (
      nameAttribute &&
      nameAttribute.value &&
      nameAttribute.value.value.toLowerCase() === "viewport"
    );
  }
  return false;
}

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: 'Enforce to use `<meta name="viewport">` in `<head>`',
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: 'Missing `<meta name="viewport">`.',
      [MESSAGE_IDS.EMPTY]:
        'Unexpected empty `content` attribute in `<meta name="viewport">`.',
    },
  },

  create(context) {
    return {
      Tag(node) {
        if (node.name !== "head") {
          return;
        }

        const metaViewport = node.children.find(isMetaViewport);

        if (!metaViewport) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING,
          });
          return;
        }

        const contentAttribute = NodeUtils.findAttr(metaViewport, "content");
        const isValueEmpty =
          !contentAttribute.value || !contentAttribute.value.value.length;

        if (isValueEmpty) {
          const reportTarget = !contentAttribute.value
            ? metaViewport
            : contentAttribute;
          context.report({
            node: reportTarget,
            messageId: MESSAGE_IDS.EMPTY,
          });
        }
      },
    };
  },
};
