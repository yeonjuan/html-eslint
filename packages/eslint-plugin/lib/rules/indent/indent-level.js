/**
 * @typedef {import("@html-eslint/types").AnyNode} AnyNode
 * @typedef {{ [key in AnyNode['type']]?: number}} IncLevelOptions
 * @typedef {(node: AnyNode) => number} GetIncreasingLevel
 */

class IndentLevel {
  /**
   * @param {Object} config
   * @param {GetIncreasingLevel} config.getIncreasingLevel
   */
  constructor(config) {
    /**
     * @member
     * @private
     * @type {number}
     */
    this.level = -1;
    /**
     * @member
     * @private
     * @type {number}
     */
    this.baseLevel = 0;
    /**
     * @member
     * @private
     */
    this.getInc = config.getIncreasingLevel;
  }

  /**
   * @returns {number}
   */
  value() {
    return this.level + this.baseLevel;
  }

  /**
   * @param {AnyNode} node
   */
  indent(node) {
    this.level += this.getInc(node);
  }

  /**
   * @param {AnyNode} node
   */
  dedent(node) {
    this.level -= this.getInc(node);
  }

  /**
   * @param {number} base
   */
  setBase(base) {
    this.baseLevel = base;
  }
}

module.exports = IndentLevel;
