/**
 * @import {TSESTree} from "@typescript-eslint/types"
 * @import {RuleModule} from "../types"
 */
const {
  classSpacing,
  CLASS_SPACING_MESSAGE_IDS,
} = require("@html-eslint/core");
const { elementNodeAdapter } = require("./utils/adapter");
const { AST_NODE_TYPES } = require("../constants/node-types");

/** @type {RuleModule<[]>} */
module.exports = {
  meta: {
    type: "layout",

    docs: {
      description: "Disallow extra spacing in className attribute values",
      category: "Stylistic Issues",
      recommended: false,
      url: "https://html-eslint.org/docs/react/rules/classname-spacing",
    },

    fixable: "code",
    schema: [],
    messages: {
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingStart]:
        "Unexpected space at the start of className attribute value",
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingEnd]:
        "Unexpected space at the end of className attribute value",
      [CLASS_SPACING_MESSAGE_IDS.extraSpacingBetween]:
        "Unexpected extra spaces between class names",
    },
  },

  create(context) {
    const ruleCore = classSpacing();
    return {
      JSXOpeningElement(node) {
        if (
          node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          node.name.name.toLocaleLowerCase() !== node.name.name ||
          node.name.name.includes("-")
        ) {
          return;
        }

        const adapter = elementNodeAdapter(node);
        const attributes = adapter.getAttributes();

        for (const attribute of attributes) {
          const attrKeyValue = attribute.key.value();

          // Only check className attributes
          if (!attrKeyValue || attrKeyValue !== "classname") {
            continue;
          }

          const results = ruleCore.checkClassAttribute(attribute);

          for (const result of results) {
            const valueNode = attribute.value.node();
            if (!valueNode) {
              continue;
            }

            const sourceCode = context.sourceCode || context.getSourceCode();
            const normalizedValue = result.data.normalized;

            // Calculate location based on spacing type
            let loc;
            const attrValue = attribute.value.value();
            if (!attrValue) {
              continue;
            }

            if (result.spacingType === "start") {
              loc = {
                start: valueNode.loc.start,
                end: {
                  line: valueNode.loc.start.line,
                  column: valueNode.loc.start.column + result.spacingLength,
                },
              };
            } else if (result.spacingType === "end") {
              loc = {
                start: {
                  line: valueNode.loc.end.line,
                  column: valueNode.loc.end.column - result.spacingLength,
                },
                end: valueNode.loc.end,
              };
            } else {
              // between
              loc = {
                start: {
                  line: valueNode.loc.start.line,
                  column: valueNode.loc.start.column + result.spacingIndex,
                },
                end: {
                  line: valueNode.loc.start.line,
                  column:
                    valueNode.loc.start.column +
                    result.spacingIndex +
                    result.spacingLength,
                },
              };
            }

            context.report({
              node: valueNode,
              loc,
              messageId: result.messageId,
              fix(fixer) {
                // For JSX, we need to handle different value node types
                if (valueNode.type === AST_NODE_TYPES.Literal) {
                  return fixer.replaceText(valueNode, `"${normalizedValue}"`);
                } else if (
                  valueNode.type === AST_NODE_TYPES.JSXExpressionContainer
                ) {
                  const expression = valueNode.expression;
                  if (expression.type === AST_NODE_TYPES.Literal) {
                    return fixer.replaceText(expression, `"${normalizedValue}"`);
                  } else if (
                    expression.type === AST_NODE_TYPES.TemplateLiteral
                  ) {
                    return fixer.replaceText(
                      expression,
                      `\`${normalizedValue}\``
                    );
                  }
                }
                return null;
              },
            });
          }
        }
      },
    };
  },
};
