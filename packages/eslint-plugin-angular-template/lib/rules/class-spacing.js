/**
 * @import {
 *   AngularElement,
 *   AngularTextAttribute,
 *   RuleModule
 * } from "../types"
 */

const {
  classSpacing,
  CLASS_SPACING_MESSAGE_IDS,
} = require("@html-eslint/core");
const { AST_NODE_TYPES } = require("../constants/node-types");
const { textAttributeAdapter } = require("./utils/adapter");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "Disallow extra spacing in class attribute values",
      recommended: true,
      category: "Stylistic Issues",
      url: "https://html-eslint.org/docs/angular-template/rules/class-spacing",
    },
    fixable: "code",
    schema: [],
    messages: {
      [CLASS_SPACING_MESSAGE_IDS.extraSpacing]:
        "Unexpected space at the start of class",
    },
  },

  create(context) {
    const ruleCore = classSpacing();

    /** @param {AngularTextAttribute} attr */
    function checkTextAttribute(attr) {
      const adapter = textAttributeAdapter(attr);
      const results = ruleCore.checkClassAttribute(adapter);

      for (const result of results) {
        if (!attr.valueSpan || !attr.loc) {
          return;
        }

        // fullStart includes leading whitespace; start skips it.
        // Use fullStart so leading-space fixes cover the entire value region.
        const fullStart = attr.valueSpan.fullStart ?? attr.valueSpan.start;
        const valueStartOffset = fullStart.offset;
        const valueEndOffset = attr.valueSpan.end.offset;
        const normalizedValue = result.data.normalized;

        // valueCol is the column of the first character inside the quotes
        const valueCol = fullStart.col;

        /** @type {import("eslint").AST.SourceLocation} */
        let loc;
        if (result.spacingType === "start") {
          loc = {
            start: { line: attr.loc.start.line, column: valueCol },
            end: {
              line: attr.loc.start.line,
              column: valueCol + result.spacingLength,
            },
          };
        } else if (result.spacingType === "end") {
          loc = {
            start: {
              line: attr.loc.end.line,
              column: attr.loc.end.column - result.spacingLength,
            },
            end: { line: attr.loc.end.line, column: attr.loc.end.column },
          };
        } else {
          loc = {
            start: {
              line: attr.loc.start.line,
              column: valueCol + result.spacingIndex,
            },
            end: {
              line: attr.loc.start.line,
              column: valueCol + result.spacingIndex + result.spacingLength,
            },
          };
        }

        context.report({
          loc,
          messageId: result.messageId,
          data: result.data,
          fix(fixer) {
            // Replace only the value part (between the quotes)
            return fixer.replaceTextRange(
              [valueStartOffset, valueEndOffset],
              normalizedValue
            );
          },
        });
      }
    }

    return {
      TextAttribute(node) {
        if (node.name !== "class") {
          return;
        }
      },
      Element(node) {
        for (const attr of node.attributes) {
          if (
            attr.type === AST_NODE_TYPES.TextAttribute &&
            attr.name.toLowerCase() === "class"
          ) {
            checkTextAttribute(attr);
          }
        }
      },
    };
  },
};
