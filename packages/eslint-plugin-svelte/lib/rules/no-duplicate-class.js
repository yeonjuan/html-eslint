/**
 * @import {
 *   RuleModule,
 *   SvelteElement
 * } from "../types.js"
 * @file Disallow duplicate class names for Svelte
 */

import {
  noDuplicateClass,
  NO_DUPLICATE_CLASS_MESSAGE_IDS,
} from "@html-eslint/core";
import { elementNodeAdapter } from "./utils/adapter.js";

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
        "The class '{{class}}' is duplicated.",
    },
  },

  create(context) {
    const ruleCore = noDuplicateClass();

    /**
     * Check if an element has duplicate class names
     *
     * @param {SvelteElement} node
     */
    function checkElement(node) {
      const adapter = elementNodeAdapter(node);
      const attributes = adapter.getAttributes();

      for (const attrAdapter of attributes) {
        const keyValue = attrAdapter.key.value();
        if (!keyValue || keyValue.toLowerCase() !== "class") {
          continue;
        }

        const attrValueNode = attrAdapter.value.node();
        if (!attrValueNode || !Array.isArray(attrValueNode)) {
          continue;
        }

        const results = ruleCore.checkClassAttribute(attrAdapter);

        for (const result of results) {
          // Get the first literal value node for location reporting
          const firstLiteral = attrValueNode.find(
            (part) => part.type === "SvelteLiteral"
          );

          if (!firstLiteral) {
            continue;
          }

          context.report({
            loc: {
              start: {
                line: firstLiteral.loc.start.line,
                column: firstLiteral.loc.start.column + result.classIndex,
              },
              end: {
                line: firstLiteral.loc.start.line,
                column:
                  firstLiteral.loc.start.column +
                  result.classIndex +
                  result.className.length,
              },
            },
            data: result.data,
            messageId: result.messageId,
            fix(fixer) {
              if (!firstLiteral) {
                return null;
              }

              const startRange = result.hasSpacesBefore
                ? firstLiteral.range[0] + result.spacesBeforePos
                : firstLiteral.range[0] + result.classIndex;

              const endRange = result.hasSpacesAfter
                ? firstLiteral.range[0] +
                  result.classIndex +
                  result.classLength +
                  result.spacesAfterLength
                : firstLiteral.range[0] +
                  result.classIndex +
                  result.classLength;

              return fixer.replaceTextRange(
                [startRange, endRange],
                result.hasClassBefore && result.hasClassAfter ? " " : ""
              );
            },
          });
        }
      }
    }

    return {
      SvelteElement: checkElement,
    };
  },
};

export default rule;
