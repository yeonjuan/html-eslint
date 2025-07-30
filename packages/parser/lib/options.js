/**
 * @import ESHtmlParser from "es-html-parser";
 * @import {ParserOptions} from "./types"
 * @import {TemplateSyntax} from "@html-eslint/template-syntax-parser";
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

  /**
   * @type {string[] | undefined}
   */
  let rawContentTags;

  if (parserOptions.rawContentTags) {
    rawContentTags = parserOptions.rawContentTags;
  }

  if (templateInfos || tokenAdapter || rawContentTags) {
    return {
      options: {
        templateInfos,
        tokenAdapter,
        rawContentTags,
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
