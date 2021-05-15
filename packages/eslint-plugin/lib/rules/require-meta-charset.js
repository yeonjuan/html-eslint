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
      description: 'Enforce to use `<meta name="chartset">` in `<head>`',
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: 'Missing `<meta name="description">`.',
      [MESSAGE_IDS.EMPTY]: "Unexpected empty charset.",
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
        const metaCharset = (node.childNodes || []).find((child) => {
          return (
            child.type === NODE_TYPES.META &&
            !!NodeUtils.findAttr(child, "charset")
          );
        });
        if (!metaCharset) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING,
          });
          return;
        }
        const charsetAttr = NodeUtils.findAttr(metaCharset, "charset");
        if (charsetAttr && !charsetAttr.value.length) {
          context.report({
            node: charsetAttr,
            messageId: MESSAGE_IDS.EMPTY,
          });
        }
      },
    };
  },
};
