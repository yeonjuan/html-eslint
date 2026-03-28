/**
 * @import {
 *   CommentContent,
 *   Text
 * } from "@html-eslint/types"
 * @import {RuleModule} from "../types"
 * @typedef {Object} Option
 * @property {number} Option.max
 */

const { parseTemplateLiteral } = require("./utils/template-literal");
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
const { getRuleUrl } = require("./utils/rule");

const DEFAULT_MAX = 80;

const MESSAGE_IDS = {
  EXCEED: "exceed",
};

/** @type {RuleModule<[Option]>} */
module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "Enforce a maximum line length",
      recommended: false,
      category: RULE_CATEGORY.STYLE,
      url: getRuleUrl("max-len"),
    },
    fixable: null,
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
      [MESSAGE_IDS.EXCEED]:
        "This line has a length of {{length}}. Maximum allowed is {{max}}.",
    },
  },

  create(context) {
    const max =
      context.options.length && context.options[0] != null
        ? context.options[0].max
        : DEFAULT_MAX;

    const sourceCode = getSourceCode(context);

    /**
     * @param {string[]} lines
     * @param {Object} offset
     * @param {number} offset.line
     * @param {number} offset.column
     * @param {(CommentContent | Text)["parts"][number][]} tokens
     */
    function check(lines, offset, tokens) {
      lines.forEach((line, index) => {
        const lineNumber = index + offset.line;
        const lineLength = line.length;
        const columnOffset = index === 0 ? offset.column : 0;

        if (lineLength > max) {
          const loc = {
            start: {
              line: lineNumber,
              column: max + columnOffset,
            },
            end: {
              line: lineNumber,
              column: lineLength + columnOffset,
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
            messageId: MESSAGE_IDS.EXCEED,
            loc,
            data: {
              length: `${lineLength}`,
              max: `${max}`,
            },
          });
        }
      });
    }

    return {
      Document() {
        check(
          sourceCode.getLines(),
          {
            line: 1,
            column: 0,
          },
          []
        );
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
            {
              line: node.quasi.loc.start.line,
              column: node.quasi.loc.start.column + 1,
            },
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
            {
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
