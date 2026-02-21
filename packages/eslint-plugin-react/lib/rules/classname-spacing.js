/**
 * @import {TSESTree} from "@typescript-eslint/types"
 * @import {RuleModule} from "../types"
 */
const {
  classSpacing,
  CLASS_SPACING_MESSAGE_IDS,
} = require("@html-eslint/core");
const { attributeNodeAdapter } = require("./utils/adapter");
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
      JSXAttribute(node) {
        const adapter = attributeNodeAdapter(node);
        if (adapter.key.value() !== "classname") {
          return;
        }
        const attrValue = adapter.value.value();
        const attrValueNode = adapter.value.node();
        if (!attrValueNode) {
          return;
        }
        const results = ruleCore.checkClassAttribute(adapter);
        for (const result of results) {
          let loc;
          if (!attrValue) {
            continue;
          }
          const normalizedValue = result.data.normalized;

          if (result.spacingType === "start") {
            loc = {
              start: attrValueNode.loc.start,
              end: {
                line: attrValueNode.loc.start.line,
                column: attrValueNode.loc.start.column + result.spacingLength,
              },
            };
          } else if (result.spacingType === "end") {
            loc = {
              start: {
                line: attrValueNode.loc.end.line,
                column: attrValueNode.loc.end.column - result.spacingLength,
              },
              end: attrValueNode.loc.end,
            };
          } else {
            loc = {
              start: {
                line: attrValueNode.loc.start.line,
                column: attrValueNode.loc.start.column + result.spacingIndex,
              },
              end: {
                line: attrValueNode.loc.start.line,
                column:
                  attrValueNode.loc.start.column +
                  result.spacingIndex +
                  result.spacingLength,
              },
            };
          }

          context.report({
            node: result.node,
            loc,
            messageId: result.messageId,
            fix(fixer) {
              if (attrValueNode.type === AST_NODE_TYPES.Literal) {
                return fixer.replaceText(attrValueNode, `"${normalizedValue}"`);
              } else if (
                attrValueNode.type === AST_NODE_TYPES.JSXExpressionContainer
              ) {
                const expression = attrValueNode.expression;
                if (expression.type === AST_NODE_TYPES.Literal) {
                  return fixer.replaceText(expression, `"${normalizedValue}"`);
                } else if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
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
      },
    };
  },
};
