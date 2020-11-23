/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

/**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");
const utils = require("./utils");

const MESSAGE_IDS = {
  DUPLICATE_ID: "duplicateId",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow to use duplicate id",
      category: CATEGORY.BEST_PRACTICE,
      recommended: true,
    },

    fixable: null,
    schema: [],
    messages: {
      [MESSAGE_IDS.DUPLICATE_ID]: "Unexpected duplicate id",
    },
  },

  create(context) {
    const IdNodesMap = new Map();
    return {
      "*"(node) {
        const idAttr = utils.findAttr(node, "id");
        if (idAttr) {
          if (!IdNodesMap.has(idAttr.value)) {
            IdNodesMap.set(idAttr.value, []);
          }
          const nodes = IdNodesMap.get(idAttr.value);
          nodes.push(node);
        }
      },
      "Program:exit"() {
        IdNodesMap.forEach((nodes) => {
          if (Array.isArray(nodes) && nodes.length > 1) {
            nodes.forEach((node) => {
              context.report({
                node: node.startTag,
                messageId: MESSAGE_IDS.DUPLICATE_ID,
              });
            });
          }
        });
      },
    };
  },
};
