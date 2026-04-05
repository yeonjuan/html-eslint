/** @import {RuleModule} from "../types" */

const { RULE_CATEGORY } = require("../constants");
const { findAttr, hasTemplate } = require("./utils/node");
const { getRuleUrl } = require("./utils/rule");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  MISSING: "missing",
  EMPTY: "empty",
};

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Require `viewBox` attribute on `<svg>` elements",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
      url: getRuleUrl("svg-require-viewbox"),
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.MISSING]: "Missing `viewBox` attribute on `<svg>`.",
      [MESSAGE_IDS.EMPTY]: "Empty `viewBox` attribute on `<svg>`.",
    },
  },

  create(context) {
    return createVisitors(context, {
      Tag(node) {
        if (node.name !== "svg") {
          return;
        }

        const viewBoxAttr = findAttr(node, "viewBox");

        if (!viewBoxAttr) {
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.MISSING,
          });
          return;
        }

        const { value } = viewBoxAttr;
        if (value && hasTemplate(value)) {
          return;
        }

        if (!value || !value.value || value.value.trim() === "") {
          context.report({
            node: viewBoxAttr,
            messageId: MESSAGE_IDS.EMPTY,
          });
        }
      },
    });
  },
};
