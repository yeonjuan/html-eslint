/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

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
    },
    fixable: true,
    schema: [],
    messages: {
      [MESSAGE_IDS.TRAILING_SPACE]: "Trailing spaces not allowed",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      Program() {
        const lines = sourceCode.lines;
        let rangeIndex = 0;

        lines.forEach((line, index) => {
          const lineNumber = index + 1;
          const match = line.match(/[ \t]+$/);
          if (match) {
            if (typeof match.index === "number") {
              const loc = {
                start: {
                  line: lineNumber,
                  column: match.index,
                },
                end: {
                  line: lineNumber,
                  column: line.length,
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
          rangeIndex += line.length;
        });
      },
    };
  },
};
