/**
 * @import {TextAdapter} from "@html-eslint/core"
 * @import {
 *   Position,
 *   Range,
 *   SourceLocation,
 *   Text
 * } from "@html-eslint/types"
 */

/** @implements {TextAdapter} */
class HTMLTextAdapter {
  /** @param {Text} node */
  constructor(node) {
    this.node = node;
    /** @type {string | null} */
    this._value = null;
    /** @type {Range | null} */
    this._range = null;
    /** @type {SourceLocation | null} */
    this._loc = null;
  }

  getValue() {
    if (this._value === null) {
      this._value = this.node.value.trim();
    }
    return this._value;
  }

  getRange() {
    if (this._range === null) {
      const originalValue = this.node.value;
      const trimmedValue = this.getValue();

      if (trimmedValue.length === 0) {
        this._range = [this.node.range[0], this.node.range[0]];
      } else {
        const trimStart = originalValue.indexOf(trimmedValue);
        const trimEnd = trimStart + trimmedValue.length;

        const startOffset = this.node.range[0] + trimStart;
        const endOffset = this.node.range[0] + trimEnd;

        this._range = [startOffset, endOffset];
      }
    }
    return this._range;
  }

  getLocation() {
    if (this._loc === null) {
      const originalValue = this.node.value;
      const trimmedValue = this.getValue();

      if (trimmedValue.length === 0) {
        this._loc = {
          start: { ...this.node.loc.start },
          end: { ...this.node.loc.start },
        };
      } else {
        const trimStart = originalValue.indexOf(trimmedValue);
        const trimEnd = trimStart + trimmedValue.length;

        this._loc = {
          start: this._getPositionFromOffset(
            this.node.value,
            this.node.loc,
            trimStart
          ),
          end: this._getPositionFromOffset(
            this.node.value,
            this.node.loc,
            trimEnd
          ),
        };
      }
    }
    return this._loc;
  }

  /**
   * @param {string} value
   * @param {SourceLocation} loc
   * @param {number} offset
   * @returns {Position}
   */
  _getPositionFromOffset(value, loc, offset) {
    const relativeOffset = offset;

    if (relativeOffset === 0) {
      return { ...loc.start };
    }

    if (relativeOffset === value.length) {
      return { ...loc.end };
    }

    const {
      start: { line: startLine, column: startColumn },
    } = loc;
    let line = startLine;
    let column = startColumn;

    for (let i = 0; i < relativeOffset; i++) {
      if (value[i] === "\n") {
        line++;
        column = 0;
      } else {
        column++;
      }
    }

    return { line, column };
  }
}

module.exports = {
  HTMLTextAdapter,
};
