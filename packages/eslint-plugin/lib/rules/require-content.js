/**
 * @import {
 *   Tag,
 *   Text
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 * @typedef {Object} Option
 * @property {string[]} [Option.elements]
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
 * Converts an element pattern string to a RegExp, or returns null if it is a
 * plain tag name. Patterns wrapped in slashes (e.g. "/^custom-/") are treated
 * as regex; all others are treated as exact, case-insensitive tag names.
 *
 * @param {string} pattern
 * @returns {RegExp | null}
 */
function toRegExp(pattern) {
  const m = pattern.match(/^\/(.+)\/([gimsuy]*)$/);
  return m ? new RegExp(m[1], m[2]) : null;
}

/**
 * Builds a matcher function from the elements option. Each item is either a
 * plain tag name or a regex pattern string ("/^custom-/").
 *
 * @param {string[]} elements
 * @returns {(tagName: string) => boolean}
 */
function buildMatcher(elements) {
  const exact = new Set();
  /** @type {RegExp[]} */
  const patterns = [];

  for (const el of elements) {
    const re = toRegExp(el);
    if (re) {
      patterns.push(re);
    } else {
      exact.add(el.toLowerCase());
    }
  }

  if (patterns.length === 0) {
    return (tagName) => exact.has(tagName);
  }
  return (tagName) =>
    exact.has(tagName) || patterns.some((re) => re.test(tagName));
}

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

/** @type {RuleModule<[Option]>} */
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
    schema: [
      {
        type: "object",
        properties: {
          elements: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.REQUIRE_CONTENT]:
        "<{{name}}> must have meaningful content or an accessible name (aria-label / aria-labelledby).",
    },
  },

  create(context) {
    const option = context.options[0] || {};
    const matchesElement =
      option.elements && option.elements.length > 0
        ? buildMatcher(option.elements)
        : /** @param {string} tagName */ (tagName) =>
            DEFAULT_ELEMENTS.has(tagName);

    return createVisitors(context, {
      Tag(node) {
        const tagName = node.name.toLowerCase();
        if (!matchesElement(tagName)) return;

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
