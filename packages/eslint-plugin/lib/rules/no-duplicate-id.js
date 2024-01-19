/**
 * @typedef { import("../types").RuleModule } RuleModule
 * @typedef { import("../types").TagNode } TagNode
 * @typedef { import("../types").StyleTagNode } StyleTagNode
 * @typedef { import("../types").ScriptTagNode } ScriptTagNode
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");

const MESSAGE_IDS = {
  DUPLICATE_ID: "duplicateId",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use duplicate id",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_ID]: "The id '{{id}}' is duplicated.",
    },
  },

  create(context) {
    const IdAttrsMap = new Map();
    return {
      /**
       * @param {TagNode | ScriptTagNode | StyleTagNode} node
       * @returns
       */
      Tag(node) {
        if (!node.attributes || node.attributes.length <= 0) {
          return;
        }
        const idAttr = findAttr(node, "id");
        if (idAttr && idAttr.value) {
          if (!IdAttrsMap.has(idAttr.value.value)) {
            IdAttrsMap.set(idAttr.value.value, []);
          }
          const nodes = IdAttrsMap.get(idAttr.value.value);
          nodes.push(idAttr.value);
        }
      },
      "Program:exit"() {
        IdAttrsMap.forEach((attrs) => {
          if (Array.isArray(attrs) && attrs.length > 1) {
            attrs.forEach((attr) => {
              context.report({
                node: attr,
                data: { id: attr.value },
                messageId: MESSAGE_IDS.DUPLICATE_ID,
              });
            });
          }
        });
      },
    };
  },
};
