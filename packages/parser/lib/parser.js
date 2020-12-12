/**
 * @typedef {import("../types").IParser} IParser
 */

const parse5 = require("parse5");
// const createASTConverter = require("./ast-converter");
const createTreeAdjuster = require('./ast-converter/tree-adjuster');
const createTreeBuilder = require('./ast-converter/tree-builder');

class Parser {
  constructor() {
    this.treeBuilder = createTreeBuilder();
    this.treeAdjuster = createTreeAdjuster();
  }

  /**
   * @param {string} code
   */
  parse(code) {
    const htmlAST = parse5.parse(code, {
      sourceCodeLocationInfo: true,
    });
    const tree = this.treeBuilder.build(htmlAST);
    this.treeAdjuster.adjust(tree);
    return tree;
  }
}

/**
 * @returns {IParser}
 */
module.exports = function createParser() {
  return new Parser();
};
