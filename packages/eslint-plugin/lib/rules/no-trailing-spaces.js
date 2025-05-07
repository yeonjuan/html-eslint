/**
 * @typedef { import("../types").RuleModule<[]> } RuleModule
 * @typedef { import("@html-eslint/types").CommentContent } CommentContent
 * @typedef { import("@html-eslint/types").Text } Text
 */

const { parse } = require("@html-eslint/template-parser");
const { RULE_CATEGORY } = require("../constants");
const {
  getTemplateTokens,
  codeToLines,
  isRangesOverlap,
} = require("./utils/node");
const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./utils/settings");
const { getSourceCode } = require("./utils/source-code");

const MESSAGE_IDS = {
  TRAILING_SPACE: "trailingSpace",
};

/**
 * @type {RuleModule}
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
    const sourceCode = getSourceCode(context);
    /**
     * @param {string} source
     * @param {string[]} lines
     * @param {Object} offset
     * @param {number} offset.range
     * @param {number} offset.line
     * @param {number} offset.column
     * @param {((CommentContent | Text)['parts'][number])[]} tokens
     */
    function check(source, lines, offset, tokens) {
      const lineBreaks = source.match(/\r\n|[\r\n\u2028\u2029]/gu);

      lines.forEach((line, index) => {
        const lineNumber = index + offset.line;
        const match = line.match(/[ \t\u00a0\u2000-\u200b\u3000]+$/);
        const lineBreakLength =
          lineBreaks && lineBreaks[index] ? lineBreaks[index].length : 1;
        const lineLength = line.length + lineBreakLength;
        const columnOffset = index === 0 ? offset.column : 0;
        if (match) {
          if (typeof match.index === "number" && match.index > 0) {
            const loc = {
              start: {
                line: lineNumber,
                column: match.index + columnOffset,
              },
              end: {
                line: lineNumber,
                column: lineLength - lineBreakLength + columnOffset,
              },
            };
            const start = sourceCode.getIndexFromLoc(loc.start);
            const end = sourceCode.getIndexFromLoc(loc.end);
            if (
              tokens.some((token) => isRangesOverlap(token.range, [start, end]))
            ) {
              return;
            }
            context.report({
              messageId: MESSAGE_IDS.TRAILING_SPACE,
              loc,
              fix(fixer) {
                return fixer.removeRange([start, end]);
              },
            });
          }
        }
      });
    }

    return {
      Document() {
        check(
          sourceCode.getText(),
          sourceCode.getLines(),
          {
            range: 0,
            line: 1,
            column: 0,
          },
          []
        );
      },
      TaggedTemplateExpression(node) {
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          const { html, tokens } = parse(
            node.quasi,
            getSourceCode(context),
            {}
          );
          const lines = codeToLines(html);
          check(
            html,
            lines,
            {
              range: node.quasi.range[0] + 1,
              line: node.quasi.loc.start.line,
              column: node.quasi.loc.start.column + 1,
            },
            getTemplateTokens(tokens)
          );
        }
      },
      TemplateLiteral(node) {
        if (shouldCheckTemplateLiteral(node, context)) {
          const { html, tokens } = parse(node, getSourceCode(context), {});
          const lines = codeToLines(html);
          check(
            html,
            lines,
            {
              range: node.range[0] + 1,
              line: node.loc.start.line,
              column: node.loc.start.column + 1,
            },
            getTemplateTokens(tokens)
          );
        }
      },
    };
  },
};
