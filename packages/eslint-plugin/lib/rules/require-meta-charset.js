/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").AnyNode } AnyNode
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { find } = require("./utils/array");
const { findAttr, isTag } = require("./utils/node");

const MESSAGE_IDS = {
  MISSING: "missing",
  EMPTY: "empty",
};

/**
 * @param {AnyNode} node
 * @returns {node is Tag}
 */
function isMetaCharset(node) {
  return isTag(node) && node.name === "meta" && !!findAttr(node, "charset");
}

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: 'Enforce to use `<meta charset="...">` in `<head>`',
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: 'Missing `<meta charset="...">`.',
      [MESSAGE_IDS.EMPTY]: "Unexpected empty charset.",
    },
  },

  create(context) {
    return {
      Tag(node) {
        if (node.name !== "head") {
          return;
        }

        const metaCharset = find(node.children, isMetaCharset);

        if (!metaCharset) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING,
          });
          return;
        }

        const charsetAttr = findAttr(metaCharset, "charset");

        if (charsetAttr) {
          if (!charsetAttr.value || !charsetAttr.value.value.length) {
            context.report({
              node: charsetAttr,
              messageId: MESSAGE_IDS.EMPTY,
            });
          }
        }
      },
    };
  },
};
