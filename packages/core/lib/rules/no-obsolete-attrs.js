/**
 * @import {
 *   ElementAdapter,
 *   NoObsoleteAttrsResult
 * } from "../types"
 */

import { OBSOLETE_ATTRS } from "../utils/obsolete-attrs";

/**
 * @type {{
 *   obsolete: "obsolete";
 * }}
 */
export const NO_OBSOLETE_ATTRS_MESSAGE_IDS = {
  obsolete: "obsolete",
};

export function noObsoleteAttrs() {
  return {
    /**
     * @param {ElementAdapter} adapter
     * @returns {NoObsoleteAttrsResult}
     */
    checkAttributes(adapter) {
      const elementName = adapter.getElementName();

      /** @type {NoObsoleteAttrsResult} */
      const result = [];

      for (const attribute of adapter.getAttributes()) {
        const attributeKey = attribute.getKey();
        const attrKeyValue = attributeKey.getValue();
        const attributeValue = attribute.getValue();
        const attrValueValueValue = attributeValue.getValue();
        // Skip if attribute key is an expression or doesn't have a value
        if (
          attributeKey.hasExpression() ||
          attrKeyValue === null ||
          attrValueValueValue === null
        ) {
          continue;
        }

        const attrName = attrKeyValue.toLowerCase();

        // Check if this attribute is in the obsolete list
        if (OBSOLETE_ATTRS[attrName]) {
          const obsoleteConfigs = OBSOLETE_ATTRS[attrName];

          // Check if this attribute is obsolete for this specific element
          for (const config of obsoleteConfigs) {
            // Handle wildcard (*) for all elements
            if (
              config.elements.includes("*") ||
              config.elements.includes(elementName)
            ) {
              result.push({
                loc: attributeKey.getLocation(),
                messageId: NO_OBSOLETE_ATTRS_MESSAGE_IDS.obsolete,
                data: {
                  attr: attrName,
                  element: elementName,
                  suggestion: config.suggestion,
                },
              });
              break;
            }
          }
        }
      }

      return result;
    },
  };
}
