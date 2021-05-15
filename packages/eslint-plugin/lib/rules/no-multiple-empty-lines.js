/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow multiple empty lines",
      category: RULE_CATEGORY.STYLE,
      recommended: false,
    },

    fixable: "whitespace",
    schema: [
      {
        type: "object",
        properties: {
          max: {
            type: "integer",
            minimum: 0,
          },
        },
        required: ["max"],
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.UNEXPECTED]: "More than {{max}} blank lines not allowed.",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const lines = sourceCode.lines;
    const max = context.options.length ? context.options[0].max : 2;
    return {
      "Program:exit"(node) {
        /** @type {number[]} */
        const nonEmptyLineNumbers = [];

        lines.forEach((line, index) => {
          if (line.trim().length > 0) {
            nonEmptyLineNumbers.push(index + 1);
          }
        });

        nonEmptyLineNumbers.forEach((current, index, arr) => {
          const before = arr[index - 1];
          if (typeof before === "number") {
            if (current - before - 1 > max) {
              context.report({
                node,
                loc: {
                  start: { line: before, column: 0 },
                  end: { line: current, column: 0 },
                },
                messageId: MESSAGE_IDS.UNEXPECTED,
                data: {
                  max,
                },
                fix(fixer) {
                  const start = sourceCode.getIndexFromLoc({
                    line: before + 1,
                    column: 0,
                  });
                  const end = sourceCode.getIndexFromLoc({
                    line: current - max,
                    column: 0,
                  });
                  return fixer.removeRange([start, end]);
                },
              });
            }
          }
        });
      },
    };
  },
};
