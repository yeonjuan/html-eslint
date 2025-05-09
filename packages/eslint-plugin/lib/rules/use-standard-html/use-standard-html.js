/**
 * @typedef { import("../../types").RuleFixer } RuleFixer
 * @typedef { import("@html-eslint/types").Attribute } Attribute
 * @typedef { import("@html-eslint/types").Text } Text
 * @typedef { import("@html-eslint/types").AnyHTMLNode } AnyHTMLNode
 * @typedef { import("html-standard").ElementSpec } ElementSpec
 * @typedef {import("../../types").Context<[Option]> } Context
 *
 * @typedef {Object} Option
 * @property {boolean} [Option.allowUnknownChildren]
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
          allowUnknownChildren: {
            type: "boolean",
          },
        },
      },
    ],
    messages: {
      [MESSAGE_IDS.REQUIRED]:
        "Element '{{parent}}' is missing a required instance of child element '{{child}}'",
      [MESSAGE_IDS.NOT_ALLOWED]:
        "Element '{{child}}' not allowed as child of element '{{parent}}'",
    },
  },
  create(context) {
    /**
     * @type {Option}
     */
    const options =
      context.options && context.options[0]
        ? context.options[0]
        : {
            allowUnknownChildren: true,
          };
    const allowUnknownChildren = options.allowUnknownChildren;
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

        checkContentModel(
          context,
          spec,
          node,
          node.children,
          allowUnknownChildren === true
        );
      },
    };
  },
};
