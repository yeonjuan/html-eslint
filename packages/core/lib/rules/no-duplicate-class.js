/**
 * @import {
 *   AttributeAdapter,
 *   NoDuplicateClassResult
 * } from "../types"
 */

/**
 * @type {{
 *   duplicateClass: "duplicateClass";
 * }}
 */
export const NO_DUPLICATE_CLASS_MESSAGE_IDS = {
  duplicateClass: "duplicateClass",
};

/**
 * Split class string into tokens (class names and spaces) with their positions
 *
 * @param {string} value - The class attribute value
 * @returns {{ value: string; pos: number }[]}
 */
function splitClassAndSpaces(value) {
  /** @type {{ value: string; pos: number }[]} */
  const result = [];
  const regex = /(\s+|\S+)/g;
  /** @type {RegExpExecArray | null} */
  let match = null;

  while ((match = regex.exec(value)) !== null) {
    result.push({
      value: match[0],
      pos: match.index,
    });
  }

  return result;
}

/**
 * @template AttributeKeyNode
 * @template AttributeValueNode
 */
export function noDuplicateClass() {
  return {
    /**
     * @param {AttributeAdapter<AttributeKeyNode, AttributeValueNode>} attribute
     * @returns {NoDuplicateClassResult<AttributeValueNode>}
     */
    checkClassAttribute(attribute) {
      /** @type {NoDuplicateClassResult<AttributeValueNode>} */
      const result = [];

      const attrValueValue = attribute.value.value();
      const valueNode = attribute.value.node();

      // Skip if no value or value is expression
      if (!attrValueValue || attribute.value.isExpression() || !valueNode) {
        return result;
      }

      const classesAndSpaces = splitClassAndSpaces(attrValueValue);
      const classSet = new Set();

      classesAndSpaces.forEach(({ value, pos }, index) => {
        const className = value.trim();

        if (className.length) {
          if (classSet.has(className)) {
            // Found a duplicate - report it
            // Include information needed for fix logic
            const before = classesAndSpaces[index - 1];
            const after = classesAndSpaces[index + 1];

            result.push({
              messageId: NO_DUPLICATE_CLASS_MESSAGE_IDS.duplicateClass,
              node: valueNode,
              data: {
                class: className,
              },
              className,
              classIndex: pos,
              classLength: value.length,
              tokenIndex: index,
              hasSpacesBefore: !!before && before.value.trim().length === 0,
              hasSpacesAfter: !!after && after.value.trim().length === 0,
              hasClassBefore: !!classesAndSpaces[index - 2],
              hasClassAfter: !!classesAndSpaces[index + 2],
              spacesBeforePos: before ? before.pos : pos,
              spacesAfterLength:
                after && after.value.trim().length === 0
                  ? after.value.length
                  : 0,
            });
          } else {
            classSet.add(className);
          }
        }
      });

      return result;
    },
  };
}
