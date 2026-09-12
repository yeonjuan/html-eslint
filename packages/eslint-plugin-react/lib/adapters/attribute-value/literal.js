/**
 * @import {AttributeValueAdapter} from "@html-eslint/core"
 * @import {
 *   Range,
 *   SourceLocation
 * } from "@html-eslint/types"
 * @import {Literal} from "../../types"
 */

/** @implements {AttributeValueAdapter} */
class LiteralAttributeValueAdapter {
  /** @param {Literal} node */
  constructor(node) {
    this.node = node;
  }

  /**
   * A literal written inside an expression container (`attr={true}`) has no
   * surrounding quotes to strip.
   *
   * @private
   * @returns {boolean}
   */
  isQuoted() {
    const { raw } = this.node;
    if (!raw || raw.length < 2) {
      return false;
    }
    const [quote] = raw;
    return (quote === '"' || quote === "'") && raw[raw.length - 1] === quote;
  }

  /** @returns {SourceLocation} */
  getLocation() {
    if (!this.isQuoted()) {
      return this.node.loc;
    }
    return {
      start: {
        column: this.node.loc.start.column + 1,
        line: this.node.loc.start.line,
      },
      end: {
        column: this.node.loc.end.column - 1,
        line: this.node.loc.end.line,
      },
    };
  }

  getRange() {
    if (!this.isQuoted()) {
      return /** @type {Range} */ (this.node.range);
    }
    return /** @type {Range} */ ([
      this.node.range[0] + 1,
      this.node.range[1] - 1,
    ]);
  }

  hasExpression() {
    return false;
  }

  /** @returns {boolean | null} */
  getBooleanValue() {
    return typeof this.node.value === "boolean" ? this.node.value : null;
  }

  getValue() {
    if (typeof this.node.value === "string") {
      return this.node.value;
    } else if (typeof this.node.value === "number") {
      return String(this.node.value);
    }
    return null;
  }
}

module.exports = {
  LiteralAttributeValueAdapter,
};
