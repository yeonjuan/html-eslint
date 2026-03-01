/**
 * @import {
 *   Literal,
 *   RuleModule,
 *   SvelteLiteral,
 *   SvelteMustacheTag,
 *   TemplateLiteral
 * } from "../types.js"
 * @file Disallow duplicate class names for Svelte
 */

import {
  noDuplicateClass,
  NO_DUPLICATE_CLASS_MESSAGE_IDS,
} from "@html-eslint/core";
import { AST_NODE_TYPES } from "../constants/node-types.js";
import { createAttributeValueAdapter } from "../adapters/attribute-value/factory.js";
import { isLiteral, isTemplateLiteral } from "./utils/node.js";

/** @type {RuleModule} */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow duplicate class names",
      recommended: false,
      category: "Best Practice",
      url: "https://html-eslint.org/docs/svelte/rules/no-duplicate-class",
    },
    fixable: "code",
    schema: [],
    messages: {
      [NO_DUPLICATE_CLASS_MESSAGE_IDS.duplicateClass]:
        "The class '{{className}}' is duplicated.",
    },
  },

  create(context) {
    const { checkClassValue } = noDuplicateClass();

    /** @param {SvelteLiteral | Literal | TemplateLiteral} node */
    function checkLiteral(node) {
      const adapter = createAttributeValueAdapter(node);
      const result = checkClassValue(adapter);
      for (const { loc, messageId, range, data } of result) {
        context.report({
          loc,
          messageId,
          data,
          fix(fixer) {
            return fixer.removeRange(range);
          },
        });
      }
    }

    /** @param {SvelteMustacheTag} node */
    function checkSvelteMustacheTag(node) {
      if (isLiteral(node.expression) || isTemplateLiteral(node.expression)) {
        checkLiteral(node.expression);
      } else if (node.expression.type === AST_NODE_TYPES.ArrayExpression) {
        node.expression.elements.forEach((element) => {
          if (!element) {
            return;
          }
          if (isLiteral(element) || isTemplateLiteral(element)) {
            checkLiteral(element);
          }
        });
      }
    }

    return {
      SvelteAttribute(node) {
        if (
          !node.key ||
          !node.key.name ||
          node.key.name.toLowerCase() !== "class" ||
          !node.value ||
          node.value.length === 0
        ) {
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
