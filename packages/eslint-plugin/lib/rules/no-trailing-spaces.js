/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");

const MESSAGE_IDS = {
  TRAILING_SPACE: "trailingSpace",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "Disallow trailing whitespace at the end of lines",
      recommended: false,
      category: RULE_CATEGORY.STYLE,
    },
    fixable: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.TRAILING_SPACE]: "Trailing spaces not allowed",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const lineBreaks = sourceCode.getText().match(/\r\n|[\r\n\u2028\u2029]/gu);

    return {
      Program() {
        const lines = sourceCode.lines;
        let rangeIndex = 0;

        lines.forEach((line, index) => {
          const lineNumber = index + 1;
          const match = line.match(/[ \t\u00a0\u2000-\u200b\u3000]+$/);
          const lineBreakLength =
            lineBreaks && lineBreaks[index] ? lineBreaks[index].length : 1;
          const lineLength = line.length + lineBreakLength;

          if (match) {
            if (typeof match.index === "number" && match.index > 0) {
              const loc = {
                start: {
                  line: lineNumber,
                  column: match.index,
                },
                end: {
                  line: lineNumber,
                  column: lineLength - lineBreakLength,
                },
              };

              context.report({
                messageId: MESSAGE_IDS.TRAILING_SPACE,
                loc,
                fix(fixer) {
                  return fixer.removeRange([
                    rangeIndex + loc.start.column,
                    rangeIndex + loc.end.column,
                  ]);
                },
              });
            }
          }
          rangeIndex += lineLength;
        });
      },
    };
  },
};
