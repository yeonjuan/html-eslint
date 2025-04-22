/**
 *  @typedef {import("eslint").AST.Program} Program
 *  @typedef {import("@eslint/plugin-kit").SourceLocation} SourceLocation
 *  @typedef {import("@eslint/core").TraversalStep} TraversalStep
 *  @typedef {import("../types").BaseNode} BaseNode
 */
const { TextSourceCodeBase } = require("@eslint/plugin-kit");

class HTMLSourceCode extends TextSourceCodeBase {
  /**
   * @param {{ast: Program, text: string}} config
   */
  constructor({ ast, text }) {
    super({ ast, text });
  }

  /**
   * @param {BaseNode} node
   * @returns {[number, number]}
   */
  getRange(node) {
    return node.range;
  }

  /**
   * @param {BaseNode} node
   * @returns {import("@eslint/plugin-kit").SourceLocation}
   */
  getLoc(node) {
    return node.loc;
  }

  traverse() {
    /**
     * @type {TraversalStep[]}
     */
    const steps = [];

    return steps;
  }
}

module.exports = {
  HTMLSourceCode,
};
