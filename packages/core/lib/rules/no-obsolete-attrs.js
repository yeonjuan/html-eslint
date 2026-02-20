/**
 * @import {
 *   ElementNodeAdapter,
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

/**
 * @template ElementNode
 * @template AttributeKeyNode
 * @template AttributeValueNode
 */
export function noObsoleteAttrs() {
  return {
    /**
     * @param {ElementNodeAdapter<
     *   ElementNode,
     *   AttributeKeyNode,
     *   AttributeValueNode
     * >} adapter
     * @returns {NoObsoleteAttrsResult<AttributeKeyNode>}
     */
    checkAttributes(adapter) {
      const elementName = adapter.getTagName();

      /** @type {NoObsoleteAttrsResult<AttributeKeyNode>} */
      const result = [];

      for (const attribute of adapter.getAttributes()) {
        const attrKeyValue = attribute.key.value();

        // Skip if attribute key is an expression or doesn't have a value
        if (attribute.key.isExpression() || !attrKeyValue) {
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
                node: attribute.key.node(),
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
