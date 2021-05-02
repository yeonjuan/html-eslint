const { RULE_CATEGORY } = require("../constants");
const { NamingUtils, NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  WRONG: "wrong",
};

const CONEVNTIONS = {
  CAMEL_CASE: "camelCase",
  SNAKE_CASE: "snake_case",
  PASCAL_CASE: "PascalCase",
  KEBAB_CASE: "kebab-case",
};

const CONVENTION_CHECKERS = {
  [CONEVNTIONS.CAMEL_CASE]: NamingUtils.isCamelCase,
  [CONEVNTIONS.SNAKE_CASE]: NamingUtils.isSnakeCase,
  [CONEVNTIONS.PASCAL_CASE]: NamingUtils.isPascalCase,
  [CONEVNTIONS.KEBAB_CASE]: NamingUtils.isKebabCase,
};

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
        enum: Object.values(CONEVNTIONS),
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
        : CONEVNTIONS.SNAKE_CASE;

    const checkNaming = CONVENTION_CHECKERS[convention];

    return {
      "*"(node) {
        const idAttr = NodeUtils.findAttr(node, "id");
        if (idAttr && idAttr.value && !checkNaming(idAttr.value)) {
          context.report({
            node: idAttr,
            data: {
              actual: idAttr.value,
              convention,
            },
            messageId: MESSAGE_IDS.WRONG,
          });
        }
      },
    };
  },
};
