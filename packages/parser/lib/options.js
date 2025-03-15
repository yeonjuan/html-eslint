/**
 * @typedef {import("./types").ParserOptions} ParserOptions
 * @typedef {import("@html-eslint/template-syntax-parser").TemplateSyntax} TemplateSyntax
 * @typedef {import("es-html-parser")} ESHtmlParser
 *
 */
const templateSyntaxParser = require("@html-eslint/template-syntax-parser");
const { parseFrontmatterContent } = require("./frontmatter");
/**
 * @param {string} code
 * @param {ParserOptions | undefined} parserOptions
 * @returns {{options: Parameters<ESHtmlParser['parse']>[1], html: string}}
 */
function getOptions(code, parserOptions) {
  let html = code;
  if (!parserOptions) {
    return {
      options: undefined,
      html,
    };
  }
  /**
   * @type {TemplateSyntax[] | undefined}
   */
  let templateInfos = undefined;
  if (parserOptions.templateEngineSyntax) {
    templateInfos = templateSyntaxParser.parse(code, {
      syntax: parserOptions.templateEngineSyntax,
    }).syntax;
  }

  /**
   * @type {any}
   */
  let tokenAdapter = undefined;
  if (parserOptions.frontmatter) {
    const result = parseFrontmatterContent(code);
    if (result) {
      html = result.html;
      const lineOffset = result.line - 1;
      tokenAdapter = {
        /**
         * @param {any} token
         */
        finalizeLocation(token) {
          const startLine = token.loc.start.line + lineOffset;
          const endLine = token.loc.end.line + lineOffset;
          return {
            start: {
              line: startLine,
              column: token.loc.start.column,
            },
            end: {
              line: endLine,
              column: token.loc.end.column,
            },
          };
        },
        /**
         * @param {any} token
         */
        finalizeRange(token) {
          return [token.range[0] + result.index, token.range[1] + result.index];
        },
      };
    }
  }

  if (templateInfos || tokenAdapter) {
    return {
      options: {
        templateInfos,
        tokenAdapter,
      },
      html,
    };
  }
  return {
    options: undefined,
    html,
  };
}

module.exports = {
  getOptions,
};
