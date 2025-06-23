/**
 * @import {Tag} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

// List of elements that are inherently focusable
const FOCUSABLE_ELEMENTS = new Set([
  "a", // if href is present
  "button",
  "input",
  "select",
  "textarea",
  "video", // if controls is present
  "audio", // if controls is present
  "details",
  "embed",
  "iframe",
  "summary",
]);

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: 'Disallow aria-hidden="true" on focusable elements',
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
      url: getRuleUrl("no-aria-hidden-on-focusable"),
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]:
        'Unexpected aria-hidden="true" on focusable element.',
    },
  },

  create(context) {
    /**
     * Checks if an element is focusable
     * @param {Tag} node
     * @returns {boolean}
     */
    function isFocusable(node) {
      const tagName = node.name.toLowerCase();

      const contentEditableAttr = findAttr(node, "contenteditable");
      if (contentEditableAttr) {
        const value = contentEditableAttr.value
          ? contentEditableAttr.value.value.toLowerCase()
          : "";
        if (value === "" || value === "true" || value === "plaintext-only") {
          return true;
        }
      }

      // Check for tabindex attribute
      const tabIndexAttr = findAttr(node, "tabindex");
      if (tabIndexAttr && tabIndexAttr.value) {
        const tabIndexValue = tabIndexAttr.value.value;
        // If tabindex is -1, the element is not focusable
        if (tabIndexValue === "-1") {
          return false;
        }
        // If tabindex is present and not -1, the element is focusable
        return true;
      }

      // Special cases for elements that are only focusable with certain attributes
      if (tagName === "a") {
        return !!findAttr(node, "href");
      }

      if (tagName === "audio" || tagName === "video") {
        return !!findAttr(node, "controls");
      }

      // Check if element is inherently focusable
      return FOCUSABLE_ELEMENTS.has(tagName);
    }

    return createVisitors(context, {
      Tag(node) {
        const ariaHiddenAttr = findAttr(node, "aria-hidden");
        if (!ariaHiddenAttr || !ariaHiddenAttr.value) {
          return;
        }

        // Only check for aria-hidden="true"
        if (ariaHiddenAttr.value.value !== "true") {
          return;
        }

        // Check if the element is focusable
        if (isFocusable(node)) {
          context.report({
            node: ariaHiddenAttr,
            messageId: MESSAGE_IDS.UNEXPECTED,
          });
        }
      },
    });
  },
};
