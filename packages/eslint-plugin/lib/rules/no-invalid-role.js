/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 */

const { NodeTypes } = require("es-html-parser");
const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const MESSAGE_IDS = {
  INVALID: "invalid",
  INVALID_PRESENTATION: "invalidPresentation",
};

/**
 * Elements and role attribute constants are taken from ember-template-lint.
 * https://github.com/ember-template-lint/ember-template-lint/blob/master/lib/rules/no-invalid-role.js
 */

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

const ELEMENTS_DISALLOWING_PRESENTATION_OR_NONE_ROLE = new Set([
  "a",
  "abbr",
  "applet",
  "area",
  "audio",
  "b",
  "bdi",
  "bdo",
  "blockquote",
  "br",
  "button",
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
  "dir",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "form",
  "hr",
  "i",
  "iframe",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meter",
  "noembed",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "select",
  "small",
  "source",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
]);

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallows use of invalid role.",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.INVALID]: "Unexpected use of invalid role '{{role}}'",
      [MESSAGE_IDS.INVALID_PRESENTATION]:
        "Unexpected use of presentation role on <{{element}}>",
    },
  },

  create(context) {
    return createVisitors(context, {
      Tag(node) {
        const role = findAttr(node, "role");
        if (!role) {
          return;
        }
        /**
         * Allow template expression.
         * ex: html`<div role=${role}></div>`
         */
        if (
          role.value &&
          role.value.parts.some((part) => part.type === NodeTypes.Template)
        ) {
          return;
        }

        const roleValue = (
          (role.value && role.value.value) ||
          ""
        ).toLowerCase();

        if (
          (roleValue === "presentation" || roleValue === "none") &&
          ELEMENTS_DISALLOWING_PRESENTATION_OR_NONE_ROLE.has(
            node.name.toLowerCase()
          )
        ) {
          context.report({
            node: role,
            messageId: MESSAGE_IDS.INVALID_PRESENTATION,
            data: {
              element: node.name,
            },
          });
        }

        if (!ALL_ROLES.has(roleValue)) {
          context.report({
            node: role,
            messageId: MESSAGE_IDS.INVALID,
            data: {
              role: roleValue,
            },
          });
        }
      },
    });
  },
};
