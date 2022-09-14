/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NamingUtils, NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  WRONG: "wrong",
};

const CONVENTIONS = {
  CAMEL_CASE: "camelCase",
  SNAKE_CASE: "snake_case",
  PASCAL_CASE: "PascalCase",
  KEBAB_CASE: "kebab-case",
};

const CONVENTION_CHECKERS = {
  [CONVENTIONS.CAMEL_CASE]: NamingUtils.isCamelCase,
  [CONVENTIONS.SNAKE_CASE]: NamingUtils.isSnakeCase,
  [CONVENTIONS.PASCAL_CASE]: NamingUtils.isPascalCase,
  [CONVENTIONS.KEBAB_CASE]: NamingUtils.isKebabCase,
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce consistent naming id attributes",
      category: RULE_CATEGORY.STYLE,
      recommended: false,
    },

    fixable: null,
    schema: [
      {
        enum: Object.values(CONVENTIONS),
      },
    ],
    messages: {
      [MESSAGE_IDS.WRONG]:
        "The id '{{actual}}' is not matched with the {{convention}}.",
    },
  },

  create(context) {
    const convention =
      context.options && context.options.length
        ? context.options[0]
        : CONVENTIONS.SNAKE_CASE;

    const checkNaming = CONVENTION_CHECKERS[convention];

    return {
      "*"(node) {
        if (!node.attributes || node.attributes.length <= 0) {
          return;
        }
        const idAttr = NodeUtils.findAttr(node, "id");
        if (idAttr && idAttr.value && !checkNaming(idAttr.value.value)) {
          context.report({
            node: idAttr,
            data: {
              actual: idAttr.value.value,
              convention,
            },
            messageId: MESSAGE_IDS.WRONG,
          });
        }
      },
    };
  },
};
