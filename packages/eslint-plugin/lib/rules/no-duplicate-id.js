/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  DUPLICATE_ID: "duplicateId",
};

/**
 * @type {Rule}
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
      "*"(node) {
        if (!node.attributes || node.attributes.length <= 0) {
          return;
        }
        const idAttr = NodeUtils.findAttr(node, "id");
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
