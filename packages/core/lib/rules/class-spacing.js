/**
 * @import {
 *   AttributeAdapter,
 *   ClassSpacingResult
 * } from "../types"
 */

const CLASS_BETWEEN_EXTRA_SPACES_REGEX = /\s{2,}/;

/**
 * @type {{
 *   extraSpacingStart: "extraSpacingStart";
 *   extraSpacingEnd: "extraSpacingEnd";
 *   extraSpacingBetween: "extraSpacingBetween";
 * }}
 */
export const CLASS_SPACING_MESSAGE_IDS = {
  extraSpacingStart: "extraSpacingStart",
  extraSpacingEnd: "extraSpacingEnd",
  extraSpacingBetween: "extraSpacingBetween",
};

/**
 * @template AttributeKeyNode
 * @template AttributeValueNode
 */
export function classSpacing() {
  return {
    /**
     * @param {AttributeAdapter<AttributeKeyNode, AttributeValueNode>} attribute
     * @returns {ClassSpacingResult<AttributeValueNode>}
     */
    checkClassAttribute(attribute) {
      /** @type {ClassSpacingResult<AttributeValueNode>} */
      const result = [];

      const attrValueValue = attribute.value.value();
      const valueNode = attribute.value.node();

      // Skip if no value or value is expression
      if (!attrValueValue || attribute.value.isExpression() || !valueNode) {
        return result;
      }

      const classValue = attrValueValue;
      const trimmedValue = classValue.trim();

      // If already normalized, skip
      if (
        classValue === trimmedValue &&
        !CLASS_BETWEEN_EXTRA_SPACES_REGEX.test(classValue)
      ) {
        return result;
      }

      const normalizedValue = trimmedValue.replace(/\s+/g, " ");

      // Check for leading spaces
      if (classValue !== trimmedValue && classValue.startsWith(" ")) {
        result.push({
          messageId: CLASS_SPACING_MESSAGE_IDS.extraSpacingStart,
          node: valueNode,
          data: {
            normalized: normalizedValue,
          },
          spacingType: "start",
          spacingLength: classValue.length - classValue.trimStart().length,
        });
        return result;
      }

      // Check for trailing spaces
      if (classValue !== trimmedValue && classValue.endsWith(" ")) {
        result.push({
          messageId: CLASS_SPACING_MESSAGE_IDS.extraSpacingEnd,
          node: valueNode,
          data: {
            normalized: normalizedValue,
          },
          spacingType: "end",
          spacingLength: classValue.length - classValue.trimEnd().length,
        });
        return result;
      }

      // Check for extra spaces between class names
      if (CLASS_BETWEEN_EXTRA_SPACES_REGEX.test(classValue)) {
        const match = classValue.match(CLASS_BETWEEN_EXTRA_SPACES_REGEX);
        if (match && match.index !== undefined) {
          result.push({
            messageId: CLASS_SPACING_MESSAGE_IDS.extraSpacingBetween,
            node: valueNode,
            data: {
              normalized: normalizedValue,
            },
            spacingType: "between",
            spacingIndex: match.index,
            spacingLength: match[0].length,
          });
        }
      }

      return result;
    },
  };
}
