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
const { isTag } = require("./utils/node");

const MESSAGE_IDS = {
  DISALLOW_CHILD: "disallowChild",
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
      [MESSAGE_IDS.DISALLOW_CHILD]: "TBD",
    },
  },
  create(context) {
    return {
      Tag(node) {
        const spec = getElementSpec(node.name);
        if (!spec || !spec.contents) {
          return;
        }

        node.children.forEach((child) => {
          if (!spec.contents) {
            return;
          }
          if (!isTag(child)) {
            return;
          }
          const isAllowed = spec.contents.some((model) => {
            if (
              model.type === "required" ||
              model.type === "oneOrMore" ||
              model.type === "zeroOrMore" ||
              model.type === "optional"
            ) {
              return model.contents.has(child.name.toLowerCase());
            }
            return false;
          });
          if (!isAllowed) {
            context.report({
              node: child,
              messageId: MESSAGE_IDS.DISALLOW_CHILD,
            });
          }
        });
      },
    };
  },
};
