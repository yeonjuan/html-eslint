/**
 * @typedef { import("@html-eslint/types").Tag } Tag
 * @typedef { import("@html-eslint/types").AnyNode } AnyNode
 *
 * @typedef {Object} Option
 * @property {string[]} [Option.allowClass]
 * @property {string[]} [Option.allowId]
 * @typedef { import("../types").RuleModule<[Option]> } RuleModule
 *
 */

const { RULE_CATEGORY } = require("../constants");
const { findAttr } = require("./utils/node");
const { createVisitors } = require("./utils/visitors");

const MESSAGE_IDS = {
  MISSING_HEIGHT: "missingHeight",
  MISSING_WIDTH: "missingWidth",
};

const TARGET_ELEMENTS = ["img", "iframe"];

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description:
        "Enforces that some elements (img, iframe) have explicitly defined width and height attributes.",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          allowClass: {
            type: "array",
            items: {
              type: "string",
            },
          },
          allowId: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.MISSING_HEIGHT]: "Missing `width` attribute for <{{name}}>",
      [MESSAGE_IDS.MISSING_WIDTH]: "Missing `height` attribute for <{{name}}>",
    },
  },

  create(context) {
    const allowClass =
      (context.options &&
        context.options[0] &&
        context.options[0].allowClass) ||
      [];
    const allowId =
      (context.options && context.options[0] && context.options[0].allowId) ||
      [];

    const allowClassSet = new Set(allowClass);
    const allowIdSet = new Set(allowId);
    return createVisitors(context, {
      Tag(node) {
        if (
          !TARGET_ELEMENTS.some(
            (element) => element === node.name.toLowerCase()
          )
        ) {
          return;
        }
        const classAttr = findAttr(node, "class");
        if (
          classAttr &&
          classAttr.value &&
          classAttr.value.value.split(" ").some((cls) => allowClassSet.has(cls))
        ) {
          return;
        }
        const idAttr = findAttr(node, "id");
        if (
          idAttr &&
          idAttr.value &&
          idAttr.value.value.split(" ").some((id) => allowIdSet.has(id))
        ) {
          return;
        }

        const width = findAttr(node, "width");
        const height = findAttr(node, "height");

        if (!height || !height.value) {
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.MISSING_HEIGHT,
            data: {
              name: node.name,
            },
          });
        }

        if (!width || !width.value) {
          context.report({
            node: node.openStart,
            messageId: MESSAGE_IDS.MISSING_WIDTH,
            data: {
              name: node.name,
            },
          });
        }
      },
    });
  },
};
