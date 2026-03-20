/**
 * @import {Tag} from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  MISSING: "missing",
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
    },
  },

  create(context) {
    return {
      Tag(node) {
        if (node.name !== "svg") {
          return;
        }

        if (!findAttr(node, "viewBox")) {
          context.report({
            node,
            messageId: MESSAGE_IDS.MISSING,
          });
        }
      },
    };
  },
};
