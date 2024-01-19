/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 */

const { NODE_TYPES } = require("@html-eslint/parser");
const { RULE_CATEGORY } = require("../constants");
const { find } = require("./utils/array");
const { findAttr } = require("./utils/node");

const MESSAGE_IDS = {
  MISSING: "missing",
  EMPTY: "empty",
};

/**
 * @param {import("../types").ChildType<TagNode>} node
 * @returns {node is TagNode}
 */
function isMetaViewport(node) {
  if (node.type === NODE_TYPES.Tag && node.name === "meta") {
    const nameAttribute = findAttr(node, "name");
    return !!(
      nameAttribute &&
      nameAttribute.value &&
      nameAttribute.value.value.toLowerCase() === "viewport"
    );
  }
  return false;
}

/**
 * @type {RuleModule}
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

        const metaViewport = find(node.children, isMetaViewport);

        if (!metaViewport) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING,
          });
          return;
        }

        const contentAttribute = findAttr(metaViewport, "content");
        const isAttributeEmpty =
          !contentAttribute ||
          !contentAttribute.value ||
          !contentAttribute.value.value.length;

        if (isAttributeEmpty) {
          const reportTarget =
            !contentAttribute || !contentAttribute.value
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
