/**
 * @import {ClassSpacingResult} from "@html-eslint/core"
 * @import {AST} from "eslint"
 * @import {
 *   JSXExpressionContainer,
 *   Literal,
 *   Node,
 *   NodeOrToken,
 *   RuleModule,
 *   TemplateLiteral
 * } from "../types"
 * @typedef {Object} Option
 * @property {string[]} [Option.callees]
 */
const {
  classSpacing,
  CLASS_SPACING_MESSAGE_IDS,
} = require("@html-eslint/core");
const { AST_NODE_TYPES } = require("../constants/node-types");
const {
  createAttributeValueAdapter,
} = require("../adapters/attribute-value/factory");

/** @type {RuleModule<[Option]>} */
module.exports = {
  meta: {
    type: "layout",

    docs: {
      description: "Disallow extra spacing in className values",
      category: "Stylistic Issues",
      recommended: true,
      url: "https://html-eslint.org/docs/react/rules/classname-spacing",
    },

    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          callees: {
            type: "array",
            items: {
              type: "string",
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [CLASS_SPACING_MESSAGE_IDS.extraSpacing]:
        "Unexpected space at the start of className",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const callees = options.callees || [];
    const ruleCore = classSpacing();

    /**
     * Check if a node matches the callees option
     *
     * @param {any} node
     * @returns {boolean}
     */
    function isTargetCallee(node) {
      if (node.callee.type === AST_NODE_TYPES.Identifier) {
        return callees.includes(node.callee.name);
      }

      return false;
    }

    /** @param {Literal | TemplateLiteral} node */
    function checkLiteral(node) {
      const adapter = createAttributeValueAdapter(node);
      const result = ruleCore.checkClassValue(adapter);
      for (const { loc, messageId, range } of result) {
        context.report({
          loc,
          messageId,
          fix(fixer) {
            return fixer.removeRange(range);
          },
        });
      }
    }

    /** @param {JSXExpressionContainer} node */
    function checkJSXExpressionContainer(node) {
      if (
        node.expression.type === AST_NODE_TYPES.Literal ||
        node.expression.type === AST_NODE_TYPES.TemplateLiteral
      ) {
        checkLiteral(node.expression);
      }
    }

    return {
      CallExpression(node) {
        if (!isTargetCallee(node)) {
          return;
        }

        for (const arg of node.arguments) {
          if (
            arg.type === AST_NODE_TYPES.Literal ||
            arg.type === AST_NODE_TYPES.TemplateLiteral
          ) {
            checkLiteral(arg);
          }
        }
      },
      JSXAttribute(node) {
        if (
          node.name.type !== AST_NODE_TYPES.JSXIdentifier ||
          node.name.name.toLowerCase() !== "classname" ||
          !node.value
        ) {
          return;
        }

        if (node.value.type === AST_NODE_TYPES.Literal) {
          checkLiteral(node.value);
        } else if (node.value.type === AST_NODE_TYPES.JSXExpressionContainer) {
          checkJSXExpressionContainer(node.value);
        }
      },
    };
  },
};
