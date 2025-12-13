/**
 * @import {SyntaxConfig, SyntaxConfigItem, TemplateSyntaxParserConfig} from "./types";
 */

const Parser = require("./parser");

/**
 * @param {SyntaxConfig} syntax
 * @returns {SyntaxConfigItem[]}
 */
function normalizeSyntaxOptions(syntax) {
  if (Array.isArray(syntax)) {
    return syntax;
  }
  return Object.entries(syntax).map(([open, close]) => ({
    open,
    close,
  }));
}

/**
 * @param {TemplateSyntaxParserConfig} config
 * @returns {SyntaxConfigItem[]}
 */
function getSyntaxPairs(config) {
  const syntaxPairs = normalizeSyntaxOptions(config.syntax);
  syntaxPairs.sort(
    (syntaxA, syntaxB) => syntaxB.open.length - syntaxA.open.length
  );
  return syntaxPairs;
}

/**
 * @param {string} code
 * @param {TemplateSyntaxParserConfig} config
 */
function parse(code, config) {
  const syntaxPairs = getSyntaxPairs(config);
  const parser = new Parser(code, syntaxPairs, config.skipRanges || []);
  return parser.parse();
}

module.exports = {
  parse,
};
