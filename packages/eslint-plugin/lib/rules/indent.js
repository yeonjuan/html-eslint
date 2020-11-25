/**
 * @typedef {import("../types").RuleCategory} RuleCategory
 */

/**
 * @type {RuleCategory}
 */
const CATEGORY = require("../constants/rule-category");

const MESSAGE_IDS = {
  WRONG_INDENT: "wrongIndent",
};

module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Enforce consistent indentation",
      category: CATEGORY.STYLE,
      recommended: false,
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
      [MESSAGE_IDS.WRONG_INDENT]:
        "Expected indentation of {{expected}} but found {{actual}}.",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const indentLevel = new IndentLevel();
    const { indentType, indentSize } = getIndentTypeAndSize(context.options);
    const indentUnit = indentType === "space" ? " ".repeat(indentSize) : "\t";

    function getLineCodeBefore(node) {
      return sourceCode.text
        .slice(node.range[0] - node.loc.start.column, node.range[0])
        .replace("\n", "");
    }

    function checkIndent(node) {
      const codeBefore = getLineCodeBefore(node);
      if (codeBefore.trim().length === 0) {
        const level = indentLevel.get();
        const expected = indentUnit.repeat(level);
        if (codeBefore !== expected) {
          const expectedData = `${
            indentType === "space" ? level * indentSize : level
          } ${indentType}`;
          const actualTabs = (codeBefore.match(/\t/g) || []).length;
          const actualSpaces = (codeBefore.match(/[^\S\t\n\r]/g) || []).length;

          let actualData = "";

          if (!actualTabs && !actualSpaces) {
            actualData = "no indent";
          }
          if (actualTabs) {
            actualData += `${indentSize} tab`;
          }
          if (actualSpaces) {
            actualData += `${
              actualData.length ? ", " : ""
            } ${indentSize} space`;
          }

          context.report({
            node,
            messageId: MESSAGE_IDS.WRONG_INDENT,
            data: {
              expected: expectedData,
              actual: actualData,
            },
            fix(fixer) {
              return fixer.replaceTextRange(
                [node.range[0] - (node.loc.start.column - 1), node.range[0]],
                expected
              );
            },
          });
        }
      }
    }

    return {
      "*"(node) {
        indentLevel.up();
        (node.childNodes || []).forEach((current) => {
          if (current.startTag) {
            checkIndent(current.startTag);
          }
          if (current.endTag) {
            checkIndent(current.endTag);
          }
        });
      },
    };
  },
};

function getIndentTypeAndSize(options) {
  let indentType = "space";
  let indentSize = 4;
  if (options.length) {
    if (options[0] === "tab") {
      indentType = "tab";
    } else {
      indentSize = options[0];
    }
  }
  return { indentType, indentSize };
}

class IndentLevel {
  constructor() {
    this.level = -1;
  }

  up() {
    this.level++;
  }

  down() {
    this.level--;
  }

  get() {
    return this.level;
  }
}
