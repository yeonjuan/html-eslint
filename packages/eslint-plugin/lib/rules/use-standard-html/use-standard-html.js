/**
 * @typedef { import("../../types").RuleFixer } RuleFixer
 * @typedef { import("@html-eslint/types").Attribute } Attribute
 * @typedef { import("@html-eslint/types").Text } Text
 * @typedef { import("@html-eslint/types").AnyHTMLNode } AnyHTMLNode
 * @typedef { import("html-standard").ElementSpec } ElementSpec
 * @typedef {import("../../types").Context<[Option]> } Context
 *
 * @typedef {Object} Option
 * @property {string[]} [Option.priority]
 * @typedef { import("../../types").RuleModule<[Option]> } RuleModule
 */

const { RULE_CATEGORY } = require("../../constants");
const { getElementSpec } = require("html-standard");
const { checkContentModel, MESSAGE_IDS } = require("./check-content-model");
const { isText } = require("../utils/node");

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
      [MESSAGE_IDS.REQUIRED]: "TBD",
      [MESSAGE_IDS.NOT_ALLOWED]: "TBD",
    },
  },
  create(context) {
    return {
      Tag(node) {
        const name = node.name.toLowerCase();
        if (name === "template") {
          return;
        }
        if (
          node.children.some(
            (child) => isText(child) && child.parts && !!child.parts.length
          )
        ) {
          return;
        }
        const spec = getElementSpec(node.name);
        if (!spec) {
          return;
        }

        checkContentModel(context, spec, node, node.children);
      },
    };
  },
};
