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
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingStart]:
        "Unexpected space at the start of class",
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingEnd]:
        "Unexpected space at the end of class",
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingBetween]:
        "Unexpected extra spaces between class names",
    },
  },

  create(context) {
    const ruleCore = classSpacing();

    /** @param {AngularTextAttribute} attr */
    function checkTextAttribute(attr) {
      const adapter = {
        key: {
          node: () => attr,
          isExpression: () => false,
          value: () => attr.name.toLowerCase(),
          raw: () => attr.name,
        },
        value: {
          node: () => attr,
          isExpression: () => false,
          value: () => attr.value,
        },
      };

      const results = ruleCore.checkClassAttribute(adapter);

      for (const result of results) {
        if (!attr.valueSpan || !attr.loc) {
          return;
        }

        const valueStartOffset = attr.valueSpan.start.offset;
        const valueEndOffset = attr.valueSpan.end.offset;
        const normalizedValue = result.data.normalized;

        /** @type {import("eslint").AST.SourceLocation} */
        let loc;
        if (result.spacingType === "start") {
          loc = {
            start: { line: attr.loc.start.line, column: attr.loc.start.column },
            end: {
              line: attr.loc.start.line,
              column: attr.loc.start.column + result.spacingLength,
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
              column: attr.loc.start.column + result.spacingIndex,
            },
            end: {
              line: attr.loc.start.line,
              column:
                attr.loc.start.column +
                result.spacingIndex +
                result.spacingLength,
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
      Element(node) {
        for (const attr of node.attributes) {
          if (
            attr.type === AST_NODE_TYPES.TextAttribute &&
            attr.name.toLowerCase() === "class"
          ) {
            checkTextAttribute(attr);
          }
        }
        // BoundAttribute ([class]="expr") is an expression —
        // classSpacing core skips it automatically via isExpression().
      },
    };
  },
};
