/**
 * @import {
 *   Tag,
 *   Text
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { isTag, isText } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  EMPTY_P: "emptyP",
};

/**
 * Returns true if a Tag node has any meaningful text content (non-empty,
 * non-whitespace text in any descendant).
 *
 * @param {Tag} node
 * @returns {boolean}
 */
function hasTextContent(node) {
  for (const child of node.children) {
    if (isText(child) && child.value.trim()) return true;
    if (isTag(child) && hasTextContent(child)) return true;
  }
  return false;
}

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description:
        "Disallow empty `<p>` elements that are used as spacing hacks.",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
      url: getRuleUrl("no-empty-p-tags"),
    },
    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.EMPTY_P]:
        "Empty <p> elements are announced by screen readers but contain no content. Use CSS margins or padding for spacing instead.",
    },
  },
  create(context) {
    return createVisitors(context, {
      Tag(node) {
        if (node.name.toLowerCase() !== "p") return;
        if (!hasTextContent(node)) {
          context.report({
            node,
            messageId: MESSAGE_IDS.EMPTY_P,
          });
        }
      },
    });
  },
};
