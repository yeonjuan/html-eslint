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
      if (node.type === NODE_TYPES.META) {
        const nameAttr = NodeUtils.findAttr(node, "name");
        return nameAttr.value.toLowerCase() === "viewport";
      }
      return false;
    }
    return {
      Head(node) {
        const metaViewport = (node.childNodes || []).find(isMetaViewport);
        if (!metaViewport) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING,
          });
          return;
        }
        const contentAttr = NodeUtils.findAttr(metaViewport, "content");
        if (!contentAttr || !contentAttr.value.length) {
          context.report({
            node: contentAttr,
            messageId: MESSAGE_IDS.EMPTY,
          });
        }
      },
    };
  },
};
