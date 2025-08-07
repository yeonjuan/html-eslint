/**
 * @import {Tag, StyleTag, ScriptTag} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule<[]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow use of accesskey attribute",
      category: RULE_CATEGORY.ACCESSIBILITY,
      recommended: false,
      url: getRuleUrl("no-accesskey-attrs"),
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "Unexpected use of accesskey attribute.",
    },
  },

  create(context) {
    /**
     * @param {Tag | ScriptTag | StyleTag} node
     */
    function check(node) {
      const accessKeyAttr = findAttr(node, "accesskey");
      if (accessKeyAttr) {
        context.report({
          node: accessKeyAttr,
          messageId: MESSAGE_IDS.UNEXPECTED,
        });
      }
    }
    return createVisitors(context, {
      Tag: check,
      ScriptTag: check,
      StyleTag: check,
    });
  },
};
