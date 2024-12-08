/**
 * @typedef {import("../../types").AnyNode} AnyNode
 * @typedef {{ [key in AnyNode['type']]?: number}} IncLevelOptions
 */

/**
 * @type {IncLevelOptions}
 */
const DEFAULT_INC_LEVELS = {
  Attribute: 1,
};

class IndentLevel {
  /**
   * @param {IncLevelOptions} [incLevels]
   */
  constructor(incLevels) {
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
     * @type {IncLevelOptions}
     */
    this.incLevels = { ...(incLevels || {}), ...DEFAULT_INC_LEVELS };
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

  /**
   * @private
   * @param {AnyNode} node
   */
  getInc(node) {
    const inc = this.incLevels[node.type];
    return inc || 1;
  }
}

module.exports = IndentLevel;
