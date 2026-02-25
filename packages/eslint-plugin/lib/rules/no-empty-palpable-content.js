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
 * Deliberately omits generic structural elements (div, section, main, …) that
 * are commonly used as CSS-only containers or JS-populated slots.
 *
 * Headings (h1–h6) are excluded — already covered by `no-empty-headings`.
 */
const DEFAULT_ELEMENTS = [
  // Paragraph / quotation — emptiness almost always a bug
  "p",
  "blockquote",
  "q",
  // Interactive — empty means no accessible name → accessibility failure
  "a",
  "button",
  "label",
  // Inline semantics — empty inline wrappers serve no purpose
  "em",
  "strong",
  "b",
  "i",
  "s",
  "u",
  "cite",
  "code",
  "kbd",
  "samp",
  "mark",
  "small",
  "sub",
  "sup",
  "var",
  "abbr",
  "dfn",
  "bdi",
  "bdo",
  "ins",
  "del",
  // List / table structure
  "li",
  "dt",
  "dd",
  "figcaption",
  "caption",
  // Metadata / output
  "time",
  "data",
  "output",
];

/**
 * Replaced / embedded elements that count as visual content even when they
 * contain no text (e.g. <img>, <svg>, <video>).
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
 * Complete set of standard HTML element names. Any tag name NOT in this set is
 * treated as a custom element or template slot (e.g. <block>, <content>,
 * <slot>) and considered potential content — because template engines expand
 * these tags at render time.
 */
const KNOWN_HTML_ELEMENTS = new Set([
  "a",
  "abbr",
  "address",
  "article",
  "aside",
  "audio",
  "b",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
]);

/**
 * Returns true if the element should be skipped because it already has an
 * accessible name or is intentionally hidden from assistive technology.
 *
 * @param {Tag} node
 * @returns {boolean}
 */
function isAccessiblyNamedOrHidden(node) {
  if (findAttr(node, "aria-label")) return true;
  if (findAttr(node, "aria-labelledby")) return true;

  const ariaHidden = findAttr(node, "aria-hidden");
  if (ariaHidden?.value?.value === "true") return true;

  const role = findAttr(node, "role");
  const roleValue = role?.value?.value ?? "";
  if (roleValue === "presentation" || roleValue === "none") return true;

  return false;
}

/**
 * Returns true if a Tag node has any meaningful content:
 *
 * - A non-empty text node in any descendant, OR
 * - A replaced/embedded element (img, svg, video, …), OR
 * - A non-standard element (custom element or template slot such as <block>,
 *   <content>, <slot>) that expands to content at render time.
 *
 * @param {Tag} node
 * @returns {boolean}
 */
function hasContent(node) {
  for (const child of node.children) {
    if (isText(child) && child.value.trim()) return true;
    if (isTag(child)) {
      const childName = child.name.toLowerCase();
      // Replaced / embedded elements count as visual content
      if (REPLACED_ELEMENTS.has(childName)) return true;
      // Non-standard elements are template/custom elements that expand at render
      if (!KNOWN_HTML_ELEMENTS.has(childName)) return true;
      if (hasContent(child)) return true;
    }
  }
  return false;
}

/** @type {RuleModule<[{ checkElements?: string[] }]>} */
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
           * Override the list of element names to check. When provided, this
           * list replaces the default set entirely.
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
      (options.checkElements ?? DEFAULT_ELEMENTS).map((el) => el.toLowerCase())
    );

    return createVisitors(context, {
      Tag(node) {
        const tagName = node.name.toLowerCase();
        if (!elements.has(tagName)) return;

        // Skip elements with an accessible name or that are hidden from AT
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
