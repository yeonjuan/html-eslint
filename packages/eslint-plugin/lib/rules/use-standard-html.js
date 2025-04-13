/**
 * @typedef { import("../types").RuleFixer } RuleFixer
 * @typedef { import("@html-eslint/types").Attribute } Attribute
 * @typedef { import("@html-eslint/types").Text } Text
 *
 * @typedef {Object} Option
 * @property {string[]} [Option.priority]
 * @typedef { import("../types").RuleModule<[Option]> } RuleModule
 */

const { RULE_CATEGORY } = require("../constants");
const { getElementSpec } = require("html-standard");

const MESSAGE_IDS = {
  UNSORTED: "unsorted",
};

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "TBD",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          priority: {
            type: "array",
            items: {
              type: "string",
              uniqueItems: true,
            },
          },
        },
      },
    ],
    messages: {
      [MESSAGE_IDS.UNSORTED]: "TBD",
    },
  },
  create(context) {
    return {
      Tag(node) {
        const spec = getElementSpec(node.name);
        console.log(spec);
      },
    };
  },
};
