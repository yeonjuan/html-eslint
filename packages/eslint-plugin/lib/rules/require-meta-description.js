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
        'Unexpected emtpy `conetnt` in `<meta name="description">`',
    },
  },

  create(context) {
    return {
      Head(node) {
        const metaTags = (node.childNodes || []).filter(
          (child) => child.type === NODE_TYPES.META
        );
        const descripMetaTags = metaTags.filter((meta) => {
          const nameAttr = NodeUtils.findAttr(meta, "name");
          return !!nameAttr && nameAttr.value.toLowerCase() === "description";
        });

        if (descripMetaTags.length === 0) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING,
          });
        } else {
          descripMetaTags.forEach((meta) => {
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
