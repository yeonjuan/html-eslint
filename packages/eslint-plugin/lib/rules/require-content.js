/**
 * @import {
 *   Tag,
 *   Text
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr, isTag, isText } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  REQUIRE_CONTENT: "requireContent",
};

/**
 * Default set of elements that must have meaningful content. These are elements
 * where empty content is almost always a bug or an accessibility failure.
 */
const DEFAULT_ELEMENTS = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "a",
  "button",
  "li",
  "dt",
  "dd",
  "option",
  "label",
]);

/**
 * Returns true if the element has an accessible name via ARIA attributes,
 * making visible text content optional.
 *
 * @param {Tag} node
 * @returns {boolean}
 */
function hasAriaAccessibleName(node) {
  return !!(findAttr(node, "aria-label") || findAttr(node, "aria-labelledby"));
}

/**
 * Returns true if the element is hidden from the accessibility tree.
 *
 * @param {Tag} node
 * @returns {boolean}
 */
function isHidden(node) {
  if (findAttr(node, "hidden")) return true;
  const ariaHidden = findAttr(node, "aria-hidden");
  return ariaHidden?.value?.value === "true";
}

/**
 * Returns true if the element has meaningful content — at least one child that
 * is a non-whitespace text node or a non-hidden child element.
 *
 * @param {Tag} node
 * @returns {boolean}
 */
function hasContent(node) {
  for (const child of node.children) {
    if (isText(child) && child.value.trim().length > 0) return true;
    if (isTag(child) && !isHidden(child)) return true;
  }
  return false;
}

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require that certain elements have meaningful content.",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
      url: getRuleUrl("require-content"),
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.REQUIRE_CONTENT]:
        "<{{name}}> must have meaningful content or an accessible name (aria-label / aria-labelledby).",
    },
  },

  create(context) {
    return createVisitors(context, {
      Tag(node) {
        const tagName = node.name.toLowerCase();
        if (!DEFAULT_ELEMENTS.has(tagName)) return;

        if (isHidden(node)) return;

        if (hasAriaAccessibleName(node)) return;

        if (!hasContent(node)) {
          context.report({
            loc: {
              start: node.openStart.loc.start,
              end: node.openEnd.loc.end,
            },
            data: { name: node.name },
            messageId: MESSAGE_IDS.REQUIRE_CONTENT,
          });
        }
      },
    });
  },
};
