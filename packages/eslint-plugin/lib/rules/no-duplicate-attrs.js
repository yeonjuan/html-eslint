/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").Tag } Tag
 * @typedef { import("../types").StyleTag } StyleTag
 * @typedef { import("../types").ScriptTag } ScriptTag
 */

const { RULE_CATEGORY } = require("../constants");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  DUPLICATE_ATTRS: "duplicateAttrs",
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
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_ATTRS]:
        "The attribute '{{attrName}}' is duplicated.",
    },
  },

  create(context) {
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
