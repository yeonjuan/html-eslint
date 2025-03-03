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
     * @param {number} rangeOffset
     * @param {((CommentContent | Text)['parts'][number])[]} tokens
     */
    function check(source, lines, rangeOffset, tokens) {
      let rangeIndex = rangeOffset;
      const lineBreaks = source.match(/\r\n|[\r\n\u2028\u2029]/gu);
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
    }

    return {
      Document() {
        check(sourceCode.getText(), sourceCode.getLines(), 0, []);
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
            // @ts-ignore
            node.quasi.range[0] + 1,
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
            // @ts-ignore
            node.range[0] + 1,
            getTemplateTokens(tokens)
          );
        }
      },
    };
  },
};
