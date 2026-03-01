/**
 * @import {ClassSpacingResult} from "@html-eslint/core"
 * @import {
 *   Literal,
 *   RuleModule,
 *   SvelteLiteral,
 *   SvelteMustacheTag,
 *   TemplateLiteral
 * } from "../types.js"
 * @file Disallow extra spacing in class attribute values for Svelte
 */

import { CLASS_SPACING_MESSAGE_IDS, classSpacing } from "@html-eslint/core";
import { AST_NODE_TYPES } from "../constants/node-types.js";
import { createAttributeValueAdapter } from "./adapters/attribute-value/factory.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "layout",
    docs: {
      description: "Disallow extra spacing in class attribute values",
      recommended: true,
      category: "Stylistic Issues",
      url: "https://html-eslint.org/docs/svelte/rules/class-spacing",
    },
    fixable: "code",
    schema: [],
    messages: {
      [CLASS_SPACING_MESSAGE_IDS.extraSpacing]:
        "Unexpected space at the start of class attribute value",
    },
  },

  create(context) {
    const ruleCore = classSpacing();

    /** @param {SvelteLiteral | Literal | TemplateLiteral} node */
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

    /** @param {SvelteMustacheTag} node */
    function checkSvelteMustacheTag(node) {
      if (
        node.expression.type === AST_NODE_TYPES.Literal ||
        node.expression.type === AST_NODE_TYPES.TemplateLiteral
      ) {
        checkLiteral(
          /** @type {Literal | TemplateLiteral} */ (node.expression)
        );
      } else if (node.expression.type === AST_NODE_TYPES.ArrayExpression) {
        node.expression.elements.forEach((element) => {
          if (
            element?.type === AST_NODE_TYPES.Literal ||
            element?.type === AST_NODE_TYPES.TemplateLiteral
          ) {
            checkLiteral(/** @type {Literal | TemplateLiteral} */ (element));
          }
        });
      }
    }

    return {
      SvelteAttribute(node) {
        if (
          !node.key ||
          !node.key.name ||
          node.key.name.toLowerCase() !== "class"
        ) {
          return;
        }

        if (!node.value || node.value.length === 0) {
          return;
        }

        node.value.forEach((valuePart) => {
          if (valuePart.type === AST_NODE_TYPES.SvelteLiteral) {
            checkLiteral(valuePart);
          } else if (valuePart.type === AST_NODE_TYPES.SvelteMustacheTag) {
            checkSvelteMustacheTag(valuePart);
          }
        });
      },
    };
  },
};

export default rule;
