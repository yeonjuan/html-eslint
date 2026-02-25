/**
 * @import {
 *   AngularElement,
 *   AngularTextAttribute,
 *   RuleModule
 * } from "../types"
 */

const {
  noDuplicateClass,
  NO_DUPLICATE_CLASS_MESSAGE_IDS,
} = require("@html-eslint/core");
const { AST_NODE_TYPES } = require("../constants/node-types");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "code",
    docs: {
      description: "Disallow duplicate class names",
      recommended: true,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/angular-template/rules/no-duplicate-class",
    },
    fixable: "code",
    schema: [],
    messages: {
      [NO_DUPLICATE_CLASS_MESSAGE_IDS.duplicateClass]:
        "The class '{{class}}' is duplicated.",
    },
  },

  create(context) {
    const ruleCore = noDuplicateClass();

    /** @param {AngularTextAttribute} attr */
    function checkTextAttribute(attr) {
      // value is static string — build a minimal adapter
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
        // valueSpan.start.offset points to the first character of the value
        // (inside the quotes), equivalent to range[0] in other parsers.
        const valueStartOffset = attr.valueSpan?.start.offset;

        context.report({
          loc: {
            start: {
              line: attr.loc.start.line,
              column: attr.loc.start.column + result.classIndex,
            },
            end: {
              line: attr.loc.start.line,
              column:
                attr.loc.start.column +
                result.classIndex +
                result.className.length,
            },
          },
          messageId: result.messageId,
          data: result.data,
          fix(fixer) {
            const startRange = result.hasSpacesBefore
              ? valueStartOffset + result.spacesBeforePos
              : valueStartOffset + result.classIndex;

            const endRange = result.hasSpacesAfter
              ? valueStartOffset +
                result.classIndex +
                result.classLength +
                result.spacesAfterLength
              : valueStartOffset + result.classIndex + result.classLength;

            return fixer.replaceTextRange(
              [startRange, endRange],
              result.hasClassBefore && result.hasClassAfter ? " " : ""
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
        // BoundAttribute ([class]="expr", [class.foo]="expr") is an expression
        // — noDuplicateClass core skips it automatically via isExpression().
      },
    };
  },
};
