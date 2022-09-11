/**
 * @typedef {import("es-html-parser").TagNode} TagNode
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSING: "missing",
  EMPTY: "empty",
};

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
    function isMetaViewport(node) {
      if (node.name === "meta") {
        const nameAttr = NodeUtils.findAttr(node, "name");
        return (
          nameAttr &&
          nameAttr.value &&
          nameAttr.value.value.toLowerCase() === "viewport"
        );
      }
      return false;
    }
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
        const contentAttr = NodeUtils.findAttr(metaViewport, "content");
        if (!contentAttr.value) {
          context.report({
            node: metaViewport,
            messageId: MESSAGE_IDS.EMPTY,
          });
        } else if (!contentAttr.value.value.length) {
          context.report({
            node: contentAttr,
            messageId: MESSAGE_IDS.EMPTY,
          });
        }
      },
    };
  },
};
