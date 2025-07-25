/**
 * @import {CommentContent, Text} from "@html-eslint/types";
 * @import {RuleModule} from "../types";
 *
 * @typedef {Object} Option
 * @property {number} Option.max
 */

const { parseTemplateLiteral } = require("./utils/template-literal");
const { RULE_CATEGORY } = require("../constants");
const {
  shouldCheckTaggedTemplateExpression,
  shouldCheckTemplateLiteral,
} = require("./utils/settings");
const { getSourceCode } = require("./utils/source-code");
const {
  codeToLines,
  isRangesOverlap,
  getTemplateTokens,
} = require("./utils/node");
const { getRuleUrl } = require("./utils/rule");

const MESSAGE_IDS = {
  UNEXPECTED: "unexpected",
};

/**
 * @type {RuleModule<[Option]>}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Disallow multiple empty lines",
      category: RULE_CATEGORY.STYLE,
      recommended: false,
      url: getRuleUrl("no-multiple-empty-lines"),
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
    const max = context.options.length ? context.options[0].max : 2;
    const sourceCode = getSourceCode(context);

    /**
     * @param {string[]} lines
     * @param {number} lineOffset
     * @param {((CommentContent | Text)['parts'][number])[]} tokens
     */
    function check(lines, lineOffset, tokens) {
      /** @type {number[]} */
      const nonEmptyLineNumbers = [];

      lines.forEach((line, index) => {
        if (line.trim().length > 0) {
          nonEmptyLineNumbers.push(index + lineOffset);
        }
      });

      nonEmptyLineNumbers.forEach((current, index, arr) => {
        const before = arr[index - 1];
        if (typeof before === "number") {
          if (current - before - 1 > max) {
            const start = sourceCode.getIndexFromLoc({
              line: before + 1,
              column: 0,
            });
            const end = sourceCode.getIndexFromLoc({
              line: current - max,
              column: 0,
            });
            if (
              tokens.some((token) => isRangesOverlap(token.range, [start, end]))
            ) {
              return;
            }

            context.report({
              loc: {
                start: { line: before, column: 0 },
                end: { line: current, column: 0 },
              },
              messageId: MESSAGE_IDS.UNEXPECTED,
              data: {
                max: `${max}`,
              },
              fix(fixer) {
                return fixer.removeRange([start, end]);
              },
            });
          }
        }
      });
    }
    return {
      "Document:exit"() {
        check(sourceCode.lines, 1, []);
      },
      TaggedTemplateExpression(node) {
        if (shouldCheckTaggedTemplateExpression(node, context)) {
          const { html, tokens } = parseTemplateLiteral(
            node.quasi,
            getSourceCode(context)
          );
          const lines = codeToLines(html);
          check(
            lines,
            // @ts-ignore
            node.quasi.loc.start.line,
            getTemplateTokens(tokens)
          );
        }
      },
      TemplateLiteral(node) {
        if (shouldCheckTemplateLiteral(node, context)) {
          const { html, tokens } = parseTemplateLiteral(
            node,
            getSourceCode(context)
          );
          const lines = codeToLines(html);
          check(
            lines,
            // @ts-ignore
            node.loc.start.line,
            getTemplateTokens(tokens)
          );
        }
      },
    };
  },
};
