/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr, isTag, isText } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  EMPTY_HEADING: "emptyHeading",
  INACCESSIBLE_HEADING: "inaccessibleHeading",
};

const HEADING_NAMES = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/**
 * @param {any} node
 */
function isAriaHidden(node) {
  const ariaHiddenAttr = findAttr(node, "aria-hidden");
  return ariaHiddenAttr && ariaHiddenAttr.value && ariaHiddenAttr.value.value === "true";
}

/**
 * @param {any} node
 * @returns {string}
 */
function getHeadingText(node) {
  if (!node.children) return "";
  let text = "";
  for (const child of node.children) {
    if (isText(child)) {
      text += child.value.trim();
    } else if (isTag(child) && !isAriaHidden(child)) {
      text += getHeadingText(child);
    }
  }
  return text;
}

/**
 * @param {any} node
 * @returns {boolean}
 */
function isRoleHeading(node) {
  const roleAttr = findAttr(node, "role");
  const ariaLevel = findAttr(node, "aria-level");
  return (
    !!roleAttr &&
    !!roleAttr.value &&
    roleAttr.value.value === "heading" &&
    !!ariaLevel &&
    !!ariaLevel.value &&
    !!ariaLevel.value.value
  );
}

/**
 * @param {any} node
 * @returns {string}
 */
function getAllText(node) {
  if (!node.children) return "";
  let text = "";
  for (const child of node.children) {
    if (isText(child)) {
      text += child.value.trim();
    } else if (isTag(child)) {
      text += getAllText(child);
    }
  }
  return text;
}

/**
 * @param {any} node
 * @returns {string}
 */
function getAccessibleText(node) {
  if (!node.children) return "";
  let text = "";
  for (const child of node.children) {
    if (isText(child)) {
      text += child.value.trim();
    } else if (isTag(child) && !isAriaHidden(child)) {
      text += getAccessibleText(child);
    }
  }
  return text;
}

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallow empty or inaccessible headings.",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
      url: getRuleUrl("no-empty-headings"),
    },
    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.EMPTY_HEADING]: "Headings must not be empty.",
      [MESSAGE_IDS.INACCESSIBLE_HEADING]: "Heading text is inaccessible to assistive technology.",
    },
  },
  create(context) {
    return createVisitors(context, {
      Tag(node) {
        const tagName = node.name && node.name.toLowerCase();
        const isHeadingTag = HEADING_NAMES.has(tagName);
        const isRoleHeadingEl = isRoleHeading(node);
        if (!isHeadingTag && !isRoleHeadingEl) return;
        
        // Gather all text (including aria-hidden)
        const allText = getAllText(node);
        if (!allText) {
          context.report({
            node,
            messageId: MESSAGE_IDS.EMPTY_HEADING,
          });
          return;
        }
        // Gather accessible text (not aria-hidden)
        const accessibleText = getAccessibleText(node);
        if (!accessibleText) {
          context.report({
            node,
            messageId: MESSAGE_IDS.INACCESSIBLE_HEADING,
          });
        }
      },
    });
  },
};
