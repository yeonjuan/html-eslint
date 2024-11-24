/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").StyleTagNode } StyleTagNode
 * @typedef { import("../types").ScriptTagNode } ScriptTagNode
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
     * @param {TagNode | StyleTagNode | ScriptTagNode} node
     */
    function check(node) {
      if (Array.isArray(node.attributes)) {
        const attrsSet = new Set();
        node.attributes.forEach((attr) => {
          if (attr.key && attrsSet.has(attr.key.value)) {
            context.report({
              node: attr,
              data: {
                attrName: attr.key.value,
              },
              messageId: MESSAGE_IDS.DUPLICATE_ATTRS,
            });
          } else {
            attrsSet.add(attr.key.value);
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
