/**
 * @typedef {import("../types").Rule} Rule
 * @typedef {import("../types").ElementNode} ElementNode
 * @typedef {import("../types").AttrNode} AttrNode
 * @typedef {import("../types").TagNode} TagNode
 * @typedef {import("../types").AnyNode} AnyNode
 * @typedef {import("../types").BaseNode} BaseNode
 * @typedef {Object} IndentType
 * @property {"tab"} TAB
 * @property {"space"} SPACE
 *
 * @typedef {Object} MessageId
 * @property {"wrongIndent"} WRONG_INDENT
 */
const { RULE_CATEGORY, NODE_TYPES } = require("../constants");
const { NodeUtils } = require("./utils");

/** @type {MessageId} */
const MESSAGE_ID = {
  WRONG_INDENT: "wrongIndent",
};

/** @type {IndentType} */
const INDENT_TYPES = {
  TAB: "tab",
  SPACE: "space",
};

const IGNORING_NODES = ["pre", "xmp"];

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce consistent indentation",
      category: RULE_CATEGORY.STYLE,
      recommended: true,
    },

    fixable: true,
    schema: [
      {
        oneOf: [
          {
            enum: ["tab"],
          },
          {
            type: "integer",
            minimum: 0,
          },
        ],
      },
    ],
    messages: {
      [MESSAGE_ID.WRONG_INDENT]:
        "Expected indentation of {{expected}} but found {{actual}}.",
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const { indentType, indentSize } = (function () {
      const options = context.options;
      /**
       * @type {IndentType['SPACE'] | IndentType['TAB']}
       */
      let indentType = INDENT_TYPES.SPACE;
      let indentSize = 4;
      if (options.length) {
        if (options[0] === INDENT_TYPES.TAB) {
          indentType = INDENT_TYPES.TAB;
        } else {
          indentSize = options[0];
        }
      }
      return { indentType, indentSize };
    })();

    return {
      Tag(node) {},
      "*:exit"(node) {},
    };
  },
};
