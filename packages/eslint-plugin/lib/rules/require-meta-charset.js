/**
 * @import {
 *   AnyNode,
 *   Tag
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { find } = require("./utils/array");
const { findAttr, isTag } = require("./utils/node");
const { getRuleUrl } = require("./utils/rule");

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

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: 'Enforce use of `<meta charset="...">` in `<head>`',
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("require-meta-charset"),
    },

    fixable: "code",
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
            fix(fixer) {
              return fixer.insertTextAfter(
                node.openEnd,
                '<meta charset="utf-8">'
              );
            },
          });
          return;
        }

        const charsetAttr = findAttr(metaCharset, "charset");

        if (charsetAttr) {
          if (!charsetAttr.value || !charsetAttr.value.value.length) {
            context.report({
              node: charsetAttr,
              messageId: MESSAGE_IDS.EMPTY,
              fix(fixer) {
                return fixer.replaceText(charsetAttr, 'charset="utf-8"');
              },
            });
          }
        }
      },
    };
  },
};
