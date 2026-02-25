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
 * Replaced / embedded elements that count as content even when they have no
 * text descendants (e.g. <img>, <svg>, <video>).
 */
const REPLACED_ELEMENTS = new Set([
  "img",
  "svg",
  "video",
  "audio",
  "canvas",
  "iframe",
  "embed",
  "object",
  "picture",
  "math",
  "input",
  "select",
  "textarea",
  "progress",
  "meter",
]);

/**
 * Returns true if the element should be skipped because it already has an
 * accessible name or is intentionally hidden from assistive technology.
 *
 * @param {Tag} node
 * @returns {boolean}
 */
function isAccessiblyNamedOrHidden(node) {
  // aria-label / aria-labelledby provide an accessible name even when empty
  if (findAttr(node, "aria-label")) return true;
  if (findAttr(node, "aria-labelledby")) return true;

  // aria-hidden="true" → intentionally removed from AT
  const ariaHidden = findAttr(node, "aria-hidden");
  if (ariaHidden?.value?.value === "true") return true;

  // role="presentation" or role="none" → decorative
  const role = findAttr(node, "role");
  const roleValue = role?.value?.value ?? "";
  if (roleValue === "presentation" || roleValue === "none") return true;

  return false;
}

/**
 * Returns true if a Tag node has any meaningful content:
 *   - a non-empty text node in any descendant, OR
 *   - a replaced/embedded element (img, svg, video, …) in any descendant.
 *
 * @param {Tag} node
 * @returns {boolean}
 */
function hasContent(node) {
  for (const child of node.children) {
    if (isText(child) && child.value.trim()) return true;
    if (isTag(child)) {
      if (REPLACED_ELEMENTS.has(child.name.toLowerCase())) return true;
      if (hasContent(child)) return true;
    }
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

        // Skip elements that are accessible via aria attributes, or are
        // intentionally hidden from assistive technology.
        if (isAccessiblyNamedOrHidden(node)) return;

        if (!hasContent(node)) {
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
