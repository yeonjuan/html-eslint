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
  // Skip leading whitespace check if value starts with newline
  if (value.startsWith("\n")) {
    return;
  }

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
  // Process each line separately to handle multi-line values correctly
  const lines = value.split("\n");
  let currentPos = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const isLastLine = lineIndex === lines.length - 1;
    const trimmedLine = line.trim();

    if (CLASS_BETWEEN_EXTRA_SPACES_REGEX.test(trimmedLine)) {
      const matches = trimmedLine.matchAll(
        CLASS_BETWEEN_EXTRA_SPACES_REGEX_GLOBAL
      );

      for (const match of matches) {
        if (match.index !== undefined) {
          // Calculate position within the trimmed line
          const matchIndexInTrimmed = match.index;
          const matchEndIndexInTrimmed = matchIndexInTrimmed + match[0].length;

          // Calculate position within the original line
          const lineLeadingSpaces = line.length - line.trimStart().length;
          const matchIndexInLine = lineLeadingSpaces + matchIndexInTrimmed;
          const matchEndIndexInLine = lineLeadingSpaces + matchEndIndexInTrimmed;

          // Calculate absolute position in the full value
          const absoluteMatchIndex = currentPos + matchIndexInLine;
          const absoluteMatchEndIndex = currentPos + matchEndIndexInLine;

          result.push({
            messageId: CLASS_SPACING_MESSAGE_IDS.extraSpacing,
            loc: {
              start: {
                line: loc.start.line + lineIndex,
                column:
                  lineIndex === 0
                    ? loc.start.column + matchIndexInLine + 1
                    : matchIndexInLine + 1,
              },
              end: {
                line: loc.start.line + lineIndex,
                column:
                  lineIndex === 0
                    ? loc.start.column + matchEndIndexInLine
                    : matchEndIndexInLine,
              },
            },
            range: [
              range[0] + absoluteMatchIndex + 1,
              range[0] + absoluteMatchEndIndex,
            ],
          });
        }
      }
    }

    currentPos += line.length + (isLastLine ? 0 : 1); // +1 for newline character
  }
}

/**
 * @param {string} value
 * @param {SourceLocation} loc
 * @param {Range} range
 * @param {ClassSpacingResult} result
 */
function checkTrailing(value, loc, range, result) {
  // Check for spaces before newlines (e.g., "foo \nbar")
  const lines = value.split("\n");
  let currentPos = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isLastLine = i === lines.length - 1;

    if (line.endsWith(" ")) {
      const trailingSpaces = line.length - line.trimEnd().length;
      const lineStartPos = currentPos;
      const spacingStartPos = lineStartPos + line.length - trailingSpaces;
      const spacingEndPos = lineStartPos + line.length;

      // For single-line values (i === 0 && isLastLine), use loc.end for accurate column calculation
      // For multi-line values, calculate from the start of each line
      const spacingStart = (i === 0 && isLastLine)
        ? {
            line: loc.end.line,
            column: loc.end.column - trailingSpaces,
          }
        : {
            line: loc.start.line + i,
            column: line.length - trailingSpaces,
          };
      const spacingEnd = (i === 0 && isLastLine)
        ? {
            line: loc.end.line,
            column: loc.end.column,
          }
        : {
            line: loc.start.line + i,
            column: line.length,
          };

      result.push({
        messageId: CLASS_SPACING_MESSAGE_IDS.extraSpacing,
        loc: {
          start: spacingStart,
          end: spacingEnd,
        },
        range: [range[0] + spacingStartPos, range[0] + spacingEndPos],
      });
    }

    currentPos += line.length + (isLastLine ? 0 : 1); // +1 for newline character
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
