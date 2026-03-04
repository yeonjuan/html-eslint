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
const lineBreakPattern = /\r\n|[\r\n\u2028\u2029]/u;

/**
 * @param {string} value
 * @returns {{ line: string; start: number }[]}
 */
function splitLines(value) {
  const lines = value.split(lineBreakPattern);
  let pos = 0;
  return lines.map((line, i) => {
    const entry = { line, start: pos };
    const lineBreakLength = i < lines.length - 1 ? 1 : 0;
    pos += line.length + lineBreakLength;
    return entry;
  });
}

/**
 * @param {number} lineIndex
 * @param {number} columnInLine
 * @param {SourceLocation} loc
 */
function toColumn(lineIndex, columnInLine, loc) {
  return lineIndex === 0 ? loc.start.column + columnInLine : columnInLine;
}

/**
 * @param {string} value
 * @param {SourceLocation} loc
 * @param {Range} range
 * @param {ClassSpacingResult} result
 */
function checkBetween(value, loc, range, result) {
  const lineEntries = splitLines(value);
  for (let lineIndex = 0; lineIndex < lineEntries.length; lineIndex++) {
    const { line, start: lineStart } = lineEntries[lineIndex];
    const trimmedLine = line.trim();
    if (!CLASS_BETWEEN_EXTRA_SPACES_REGEX.test(trimmedLine)) continue;

    const lineLeadingSpaces = line.length - line.trimStart().length;

    for (const match of trimmedLine.matchAll(
      CLASS_BETWEEN_EXTRA_SPACES_REGEX_GLOBAL
    )) {
      const matchStartInLine = lineLeadingSpaces + match.index;
      const matchEndInLine = matchStartInLine + match[0].length;

      result.push({
        messageId: CLASS_SPACING_MESSAGE_IDS.extraSpacing,
        loc: {
          start: {
            line: loc.start.line + lineIndex,
            column: toColumn(lineIndex, matchStartInLine, loc) + 1,
          },
          end: {
            line: loc.start.line + lineIndex,
            column: toColumn(lineIndex, matchEndInLine, loc),
          },
        },
        range: [
          range[0] + lineStart + matchStartInLine + 1,
          range[0] + lineStart + matchEndInLine,
        ],
      });
    }
  }
}

/**
 * @param {string} line
 * @param {number} lineIndex
 * @param {boolean} isSingleLine
 * @param {SourceLocation} loc
 */
function trailingLoc(line, lineIndex, isSingleLine, loc) {
  const trailingSpaces = line.length - line.trimEnd().length;
  if (isSingleLine) {
    return {
      start: { line: loc.end.line, column: loc.end.column - trailingSpaces },
      end: { line: loc.end.line, column: loc.end.column },
    };
  }
  const columnOffset = lineIndex === 0 ? loc.start.column : 0;
  return {
    start: {
      line: loc.start.line + lineIndex,
      column: columnOffset + line.length - trailingSpaces,
    },
    end: {
      line: loc.start.line + lineIndex,
      column: columnOffset + line.length,
    },
  };
}

/**
 * @param {string} value
 * @param {SourceLocation} loc
 * @param {Range} range
 * @param {ClassSpacingResult} result
 */
function checkTrailing(value, loc, range, result) {
  const lineEntries = splitLines(value);
  const isSingleLine = lineEntries.length === 1;

  for (let i = 0; i < lineEntries.length; i++) {
    const { line, start: lineStart } = lineEntries[i];
    if (!line.endsWith(" ")) continue;

    const trailingSpaces = line.length - line.trimEnd().length;
    result.push({
      messageId: CLASS_SPACING_MESSAGE_IDS.extraSpacing,
      loc: trailingLoc(line, i, isSingleLine, loc),
      range: [
        range[0] + lineStart + line.length - trailingSpaces,
        range[0] + lineStart + line.length,
      ],
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
