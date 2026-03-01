/**
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {
 *   AttributeAdapter,
 *   AttributeValueAdapter,
 *   ClassSpacingResult
 * } from "../types"
 */

const CLASS_BETWEEN_EXTRA_SPACES_REGEX = /\s{2,}/;
const CLASS_BETWEEN_EXTRA_SPACES_REGEX_GLOBAL = /\s{2,}/g;

/**
 * @type {{
 *   extraSpacing: "extraSpacing";
 * }}
 */
export const CLASS_SPACING_MESSAGE_IDS = {
  extraSpacing: "extraSpacing",
};

/**
 * @param {string} value
 * @param {SourceLocation} loc
 * @param {Range} range
 * @param {ClassSpacingResult} result
 */
function checkLeading(value, loc, range, result) {
  if (value.startsWith(" ")) {
    const leadingSpaces = value.length - value.trimStart().length;
    const spacingStart = loc.start;
    const spacingEnd = {
      line: spacingStart.line,
      column: spacingStart.column + leadingSpaces,
    };
    /** @type {Range} */
    const spacingRange = [range[0], range[0] + leadingSpaces];
    result.push({
      messageId: CLASS_SPACING_MESSAGE_IDS.extraSpacing,
      loc: {
        start: spacingStart,
        end: spacingEnd,
      },
      range: spacingRange,
    });
  }
}

/**
 * @param {string} value
 * @param {SourceLocation} loc
 * @param {Range} range
 * @param {ClassSpacingResult} result
 */
function checkBetween(value, loc, range, result) {
  const trimmedValue = value.trim();
  if (CLASS_BETWEEN_EXTRA_SPACES_REGEX.test(trimmedValue)) {
    const leadingSpaces = value.length - value.trimStart().length;
    const matches = trimmedValue.matchAll(
      CLASS_BETWEEN_EXTRA_SPACES_REGEX_GLOBAL
    );

    for (const match of matches) {
      if (match.index !== undefined) {
        const matchIndex = leadingSpaces + match.index;
        const matchEndIndex = matchIndex + match[0].length;
        const { start } = loc;
        const spacingStart = {
          line: start.line,
          column: start.column + matchIndex + 1,
        };
        const spacingEnd = {
          line: start.line,
          column: start.column + matchEndIndex,
        };
        /** @type {Range} */
        const spacingRange = [
          range[0] + matchIndex + 1,
          range[0] + matchEndIndex,
        ];

        result.push({
          messageId: CLASS_SPACING_MESSAGE_IDS.extraSpacing,
          loc: {
            start: spacingStart,
            end: spacingEnd,
          },
          range: spacingRange,
        });
      }
    }
  }
}

/**
 * @param {string} value
 * @param {SourceLocation} loc
 * @param {Range} range
 * @param {ClassSpacingResult} result
 */
function checkTrailing(value, loc, range, result) {
  if (value.endsWith(" ")) {
    const trailingSpaces = value.length - value.trimEnd().length;
    const spacingEnd = loc.end;
    const spacingStart = {
      line: spacingEnd.line,
      column: spacingEnd.column - trailingSpaces,
    };
    /** @type {Range} */
    const spacingRange = [range[1] - trailingSpaces, range[1]];
    result.push({
      messageId: CLASS_SPACING_MESSAGE_IDS.extraSpacing,
      loc: {
        start: spacingStart,
        end: spacingEnd,
      },
      range: spacingRange,
    });
  }
}

export function classSpacing() {
  return {
    /**
     * @param {AttributeValueAdapter} classValue
     * @returns {ClassSpacingResult}
     */
    checkClassValue(classValue) {
      /** @type {ClassSpacingResult} */
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

      checkLeading(value, loc, range, result);
      checkBetween(value, loc, range, result);
      checkTrailing(value, loc, range, result);

      return result;
    },
  };
}
