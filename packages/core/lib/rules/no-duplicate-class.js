/**
 * @import {
 *   AttributeValueAdapter,
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

export function noDuplicateClass() {
  return {
    /**
     * @param {AttributeValueAdapter} classValue
     * @returns {NoDuplicateClassResult}
     */
    checkClassValue(classValue) {
      /** @type {NoDuplicateClassResult} */
      const result = [];

      if (classValue.hasExpression()) {
        return result;
      }

      const value = classValue.getValue();
      if (!value) {
        return result;
      }

      const loc = classValue.getLocation();
      const range = classValue.getRange();

      const classesAndSpaces = splitClassAndSpaces(value);
      const classSet = new Set();

      classesAndSpaces.forEach(({ value, pos }) => {
        const className = value.trim();

        if (className.length) {
          if (classSet.has(className)) {
            const classStart = {
              line: loc.start.line,
              column: loc.start.column + pos,
            };
            const classEnd = {
              line: loc.start.line,
              column: loc.start.column + pos + value.length,
            };
            result.push({
              messageId: NO_DUPLICATE_CLASS_MESSAGE_IDS.duplicateClass,
              loc: {
                start: classStart,
                end: classEnd,
              },
              range: [range[0] + pos, range[0] + pos + value.length],
              data: {
                className,
              },
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
