/**
 *  @typedef {import("eslint").AST.Program} Program
 * @typedef {import('@html-eslint/types').AnyHTMLNode} AnyHTMLNode
 */
const { VisitNodeStep } = require("@eslint/plugin-kit");

const STEP_PHASE = {
  /**
   * @type {1}
   */
  ENTER: 1,
  /**
   * @type {2}
   */
  EXIT: 2,
};

class HTMLTraversalStep extends VisitNodeStep {
  /**
   * @param {Object} options
   * @param {AnyHTMLNode | Program} options.target
   * @param {1|2} options.phase
   * @param {Array<any>} options.args
   */
  constructor({ target, phase, args }) {
    super({ target, phase, args });
    this.target = target;
  }
}

module.exports = {
  HTMLTraversalStep,
  STEP_PHASE,
};
