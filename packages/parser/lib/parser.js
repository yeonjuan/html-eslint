/**
 * @typedef {import("../types").IParser} IParser
 */

const parse5 = require("parse5");
const createASTConverter = require("./ast-converter");

class Parser {
  constructor() {
    this.astCoverter = createASTConverter();
  }

  /**
   * @param {string} code
   */
  parse(code) {
    const htmlAST = parse5.parse(code);
    return this.astCoverter.convert(htmlAST);
  }
}

/**
 * @returns {IParser}
 */
module.exports = function createParser() {
  return new Parser();
};
