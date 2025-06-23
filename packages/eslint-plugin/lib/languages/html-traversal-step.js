/**
 * @import {AST} from 'eslint';
 * @import {AnyHTMLNode} from '@html-eslint/types';
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
   * @param {AnyHTMLNode | AST.Program} options.target
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
