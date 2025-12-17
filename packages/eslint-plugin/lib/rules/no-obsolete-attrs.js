/**
 * @import {Tag, StyleTag, ScriptTag} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 */

const { RULE_CATEGORY } = require("../constants");
const { OBSOLETE_ATTRS } = require("../specs");
const { createVisitors } = require("./utils/visitors");
const { getRuleUrl } = require("./utils/rule");
const { getNameOf } = require("./utils/node");

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
      description: "Disallow use of obsolete attributes in HTML5",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
      url: getRuleUrl("no-obsolete-attrs"),
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]:
        "The {{attr}} attribute on <{{element}}> is obsolete. {{suggestion}}",
    },
  },

  create(context) {
    /**
     * @param {Tag | ScriptTag | StyleTag} node
     */
    function checkObsoleteAttrs(node) {
      const tagName = getNameOf(node);
      // Check each attribute on the element
      if (node.attributes) {
        for (const attr of node.attributes) {
          const attrName = attr.key.value.toLowerCase();

          // Check if this attribute is in the obsolete list
          if (OBSOLETE_ATTRS[attrName]) {
            const obsoleteConfigs = OBSOLETE_ATTRS[attrName];

            // Check if this attribute is obsolete for this specific element
            for (const config of obsoleteConfigs) {
              // Handle wildcard (*) for all elements
              if (
                config.elements.includes("*") ||
                config.elements.includes(tagName)
              ) {
                context.report({
                  node: attr,
                  messageId: MESSAGE_IDS.UNEXPECTED,
                  data: {
                    attr: attrName,
                    element: tagName,
                    suggestion: config.suggestion,
                  },
                });
                break;
              }
            }
          }
        }
      }
    }

    return createVisitors(context, {
      Tag: checkObsoleteAttrs,
      ScriptTag: checkObsoleteAttrs,
      StyleTag: checkObsoleteAttrs,
    });
  },
};
