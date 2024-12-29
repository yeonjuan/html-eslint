/**
 * @typedef { import("../types").RuleModule } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const MESSAGE_IDS = {
  INVALID: "invalid",
};

// https://www.w3.org/TR/wai-aria/#document_structure_roles
const DOCUMENT_STRUCTURE_ROLES = new Set([
  "application",
  "article",
  "associationlist",
  "associationlistitemkey",
  "associationlistitemvalue",
  "blockquote",
  "caption",
  "cell",
  "code",
  "columnheader",
  "comment",
  "definition",
  "deletion",
  "directory",
  "document",
  "emphasis",
  "feed",
  "figure",
  "generic",
  "group",
  "heading",
  "img",
  "insertion",
  "list",
  "listitem",
  "mark",
  "math",
  "meter",
  "none",
  "note",
  "paragraph",
  "presentation",
  "row",
  "rowgroup",
  "rowheader",
  "separator", // When not focusable
  "strong",
  "subscript",
  "suggestion",
  "superscript",
  "table",
  "term",
  "time",
  "toolbar",
  "tooltip",
]);

// https://www.w3.org/TR/wai-aria/#widget_roles
const WIDGET_ROLES = new Set([
  "button",
  "checkbox",
  "gridcell",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "progressbar",
  "radio",
  "scrollbar",
  "searchbox",
  "separator", // When focusable
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "tabpanel",
  "textbox",
  "treeitem",
]);

const COMPOSITE_WIDGET_ROLES = new Set([
  "combobox",
  "grid",
  "listbox",
  "menu",
  "menubar",
  "radiogroup",
  "tablist",
  "tree",
  "treegrid",
]);

// https://www.w3.org/TR/wai-aria/#landmark_roles
const LANDMARK_ROLES = new Set([
  "banner",
  "complementary",
  "contentinfo",
  "form",
  "main",
  "navigation",
  "region",
  "search",
]);

// https://www.w3.org/TR/wai-aria/#live_region_roles
const LIVE_REGION_ROLES = new Set([
  "alert",
  "log",
  "marquee",
  "status",
  "timer",
]);

// https://www.w3.org/TR/wai-aria/#window_roles
const WINDOW_ROLES = new Set(["alertdialog", "dialog"]);

const ALL_ROLES = new Set([
  ...DOCUMENT_STRUCTURE_ROLES,
  ...WIDGET_ROLES,
  ...COMPOSITE_WIDGET_ROLES,
  ...LANDMARK_ROLES,
  ...LIVE_REGION_ROLES,
  ...WINDOW_ROLES,
]);

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow using invalid role",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.INVALID]: "TODO",
    },
  },

  create(context) {
    return createVisitors(context, {
      Tag(node) {
        const role = findAttr(node, "role");
        if (!role) {
          return;
        }
        const roleValue = (role.value && role.value.value) || "";

        if (!ALL_ROLES.has(roleValue.toLowerCase())) {
          context.report({
            node: role,
            messageId: MESSAGE_IDS.INVALID,
          });
        }
      },
    });
  },
};
