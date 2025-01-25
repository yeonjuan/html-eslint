/**
 * @typedef {import("./types").TemplateSyntaxParserConfig} TemplateSyntaxParserConfig
 */

const Parser = require("./parser");

/**
 * @param {string} code
 * @param {TemplateSyntaxParserConfig} config
 */
function parse(code, config) {
  const syntaxPairs = Object.entries(config.syntax) || [];
  syntaxPairs.sort((syntaxA, syntaxB) => syntaxB[0].length - syntaxA[0].length);
  const parser = new Parser(code, syntaxPairs, config.skipRanges || []);
  return parser.parse();
}

module.exports = {
  parse,
};
