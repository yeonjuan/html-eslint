/**
 * @import {TemplateSyntax} from "@html-eslint/template-syntax-parser"
 * @import ESHtmlParser from "es-html-parser"
 * @import {ParserOptions} from "./types"
 */

const templateSyntaxParser = require("@html-eslint/template-syntax-parser");
const { parseFrontmatterContent } = require("./frontmatter");

/**
 * Normalize the templateEngineSyntax option to a plain SyntaxConfigItem[] so
 * that the branch-annotation pass can inspect the `.branch` property on each
 * item. The template-syntax-parser performs the same normalization internally;
 * we replicate it here rather than reaching into its internals.
 *
 * @param {ParserOptions["templateEngineSyntax"]} syntax
 * @returns {{ open: string; close: string; [key: string]: unknown }[]}
 */
function normalizeSyntax(syntax) {
  if (!syntax) return [];
  if (Array.isArray(syntax)) {
    // Return a shallow copy to avoid mutating frozen exports from @html-eslint/parser
    return syntax.map((item) => ({
      ...item,
      branch: item.branch ? { ...item.branch } : undefined,
    }));
  }
  // Record<string, string> shorthand form — no branch config possible.
  return Object.entries(syntax).map(([open, close]) => ({ open, close }));
}

/**
 * @param {string} code
 * @param {ParserOptions | undefined} parserOptions
 * @returns {{
 *   options: Parameters<ESHtmlParser["parse"]>[1];
 *   html: string;
 *   syntaxItems: { open: string; close: string; [key: string]: unknown }[];
 *   frontmatterOffset: number;
 * }}
 */
function getOptions(code, parserOptions) {
  let html = code;
  if (!parserOptions) {
    return {
      options: undefined,
      html,
      syntaxItems: [],
      frontmatterOffset: 0,
    };
  }

  /** @type {any} */
  let tokenAdapter = undefined;
  let frontmatterOffset = 0;

  if (parserOptions.frontmatter) {
    const result = parseFrontmatterContent(code);
    if (result) {
      html = result.html;
      frontmatterOffset = result.index;
      const lineOffset = result.line - 1;
      tokenAdapter = {
        /** @param {any} token */
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
        /** @param {any} token */
        finalizeRange(token) {
          return [token.range[0] + result.index, token.range[1] + result.index];
        },
      };
    }
  }

  /** @type {TemplateSyntax[] | undefined} */
  let templateInfos = undefined;
  if (parserOptions.templateEngineSyntax) {
    templateInfos = templateSyntaxParser.parse(html, {
      syntax: parserOptions.templateEngineSyntax,
    }).syntax;
  }

  /** @type {string[] | undefined} */
  let rawContentTags;

  if (parserOptions.rawContentTags) {
    rawContentTags = parserOptions.rawContentTags;
  }

  const syntaxItems = normalizeSyntax(parserOptions.templateEngineSyntax);

  if (templateInfos || tokenAdapter || rawContentTags) {
    return {
      options: {
        templateInfos,
        tokenAdapter,
        rawContentTags,
      },
      html,
      syntaxItems,
      frontmatterOffset,
    };
  }
  return {
    options: undefined,
    html,
    syntaxItems,
    frontmatterOffset,
  };
}

module.exports = {
  getOptions,
};
