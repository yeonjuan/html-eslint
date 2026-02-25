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
  EMPTY: "empty",
};

/**
 * Default set of palpable content element names whose empty state is an
 * accessibility concern (screen readers announce the element but find no
 * content inside it).
 *
 * Headings (h1–h6) are intentionally excluded — they are already covered
 * by the `no-empty-headings` rule.
 *
 * Void / replaced elements (img, input, br, hr, …) are excluded because
 * they cannot contain child nodes.
 */
const DEFAULT_ELEMENTS = [
  // Block / flow elements
  "p",
  "div",
  "section",
  "article",
  "aside",
  "main",
  "nav",
  "header",
  "footer",
  "address",
  "blockquote",
  "pre",
  "figure",
  "figcaption",
  // Interactive
  "a",
  "button",
  "label",
  "details",
  "summary",
  // Inline / phrasing
  "span",
  "em",
  "strong",
  "b",
  "i",
  "s",
  "u",
  "q",
  "cite",
  "code",
  "kbd",
  "samp",
  "mark",
  "small",
  "sub",
  "sup",
  "var",
  "output",
  "time",
  "data",
  "dfn",
  "abbr",
  "bdi",
  "bdo",
  "ins",
  "del",
  // List / table structure
  "li",
  "dt",
  "dd",
  "caption",
  // Form structure
  "fieldset",
  "legend",
];

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

/** @type {RuleModule<[{checkElements?: string[]}]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description:
        "Disallow empty palpable content elements that are announced by assistive technology but contain no content.",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
      url: getRuleUrl("no-empty-palpable-content"),
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          /**
           * Override the list of element names to check.
           * When provided, this list replaces the default set entirely.
           */
          checkElements: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.EMPTY]:
        "Empty <{{tag}}> elements are announced by screen readers but contain no content. Add text content or remove the element.",
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const elements = new Set(
      (options.checkElements ?? DEFAULT_ELEMENTS).map((el) =>
        el.toLowerCase()
      )
    );

    return createVisitors(context, {
      Tag(node) {
        const tagName = node.name.toLowerCase();
        if (!elements.has(tagName)) return;
        if (!hasTextContent(node)) {
          context.report({
            node,
            messageId: MESSAGE_IDS.EMPTY,
            data: { tag: tagName },
          });
        }
      },
    });
  },
};
