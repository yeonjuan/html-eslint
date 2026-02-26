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

/**
 * Get the indentation string for inserting a new child inside a head tag.
 *
 * @param {Tag} headNode
 * @returns {string}
 */
function getChildIndent(headNode) {
  const children = headNode.children;
  if (children.length > 0) {
    // If first child is a text node (e.g. "\n    "), extract trailing whitespace
    const first = children[0];
    if (first.type === "Text" && first.value) {
      const match = first.value.match(/\n([ \t]*)$/);
      if (match) {
        return match[1];
      }
    }
    // Non-text first child: use its column position
    return " ".repeat(first.loc.start.column);
  }
  // Empty head: use head's column + 2-space indent
  return " ".repeat(headNode.loc.start.column + 2);
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
              const indent = getChildIndent(node);
              return fixer.insertTextAfterRange(
                node.openEnd.range,
                `\n${indent}<meta charset="UTF-8">`
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
                if (charsetAttr.value) {
                  // <meta charset=""> — replace empty value with UTF-8
                  return fixer.replaceTextRange(
                    charsetAttr.value.range,
                    "UTF-8"
                  );
                } else {
                  // <meta charset> — append ="UTF-8" after key
                  return fixer.insertTextAfterRange(
                    charsetAttr.key.range,
                    '="UTF-8"'
                  );
                }
              },
            });
          }
        }
      },
    };
  },
};
