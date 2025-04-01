/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").StyleTag } StyleTag
 * @typedef { import("@html-eslint/types").ScriptTag } ScriptTag
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 * @typedef { import("@html-eslint/types").Attribute } Attribute
 * @typedef { import("../types").SuggestionReportDescriptor } SuggestionReportDescriptor
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  DUPLICATE_ATTRS: "duplicateAttrs",
  REMOVE_ATTR: "removeAttr",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use duplicate attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_ATTRS]:
        "The attribute '{{attrName}}' is duplicated.",
      [MESSAGE_IDS.REMOVE_ATTR]:
        "Remove this duplicate '{{attrName}}' attribute.",
    },
  },

  create(context) {
    /**
     * @param {Attribute} node
     * @returns {SuggestionReportDescriptor[]}
     */
    function getSuggestions(node) {
      return [
        {
          messageId: MESSAGE_IDS.REMOVE_ATTR,
          fix: (fixer) => fixer.removeRange(node.range),
          data: {
            attrName: node.key.value,
          },
        },
      ];
    }

    /**
     * @param {Tag | StyleTag | ScriptTag} node
     */
    function check(node) {
      if (Array.isArray(node.attributes)) {
        const attrsSet = new Set();
        node.attributes.forEach((attr) => {
          if (attr.key && attrsSet.has(attr.key.value.toLowerCase())) {
            context.report({
              node: attr,
              data: {
                attrName: attr.key.value,
              },
              messageId: MESSAGE_IDS.DUPLICATE_ATTRS,
              suggest: getSuggestions(attr),
            });
          } else {
            attrsSet.add(attr.key.value.toLowerCase());
          }
        });
      }
    }
    return createVisitors(context, {
      Tag: check,
      StyleTag: check,
      ScriptTag: check,
    });
  },
};
