const { visitorKeys, parseForESLint } = require("@html-eslint/parser");
const { HTMLSourceCode } = require("./html-source-code");

/**
 * @import { Language, ParseResult, File, FileError, OkParseResult } from "@eslint/core";
 * @import { ParserOptions } from "@html-eslint/parser";
 * @import { AST } from "eslint";
 */

/**
 * @implements {Language<{ LangOptions: ParserOptions; Code: HTMLSourceCode; RootNode: AST.Program; Node: {}}>}
 */
class HTMLLanguage {
  constructor() {
    /**
     * @property
     * @type {"text"}
     */
    this.fileType = "text";

    /**
     * @property
     * @type {0|1}
     */
    this.lineStart = 1;

    /**
     * @property
     * @type {0|1}
     */
    this.columnStart = 0;

    /**
     * @type {string}
     */
    this.nodeTypeKey = "type";

    /**
     * The visitor keys for the es-html-parser AST.
     * @type {Record<string, string[]>}
     */
    this.visitorKeys = visitorKeys;
  }

  /**
   * @param {ParserOptions} languageOptions
   */
  validateLanguageOptions(languageOptions) {
    if (!languageOptions) {
      return;
    }
    if (
      "frontmatter" in languageOptions &&
      typeof languageOptions.frontmatter !== "boolean"
    ) {
      throw new TypeError("Expected a boolean value for 'frontmatter' option.");
    }
    if (
      "templateEngineSyntax" in languageOptions &&
      (typeof languageOptions.templateEngineSyntax !== "object" ||
        !languageOptions.templateEngineSyntax)
    ) {
      throw new TypeError(
        "Expected an key-value record value for 'templateEngineSyntax' option."
      );
    }
  }

  /**
   * @param {File} file
   * @param {Object} [context]
   * @param {ParserOptions} context.languageOptions
   * @returns {ParseResult<AST.Program>}
   */
  parse(file, context) {
    const code = /**  @type {string} */ (file.body);
    const languageOptions = (context && context.languageOptions) || {};
    try {
      const result = parseForESLint(code, languageOptions);
      return {
        ok: true,
        ast: result.ast,
        comments: result.ast.comments,
      };
    } catch (e) {
      return {
        ok: false,
        errors: [/** @type {FileError} */ (e)],
      };
    }
  }

  /**
   * @param {File} file
   * @param {OkParseResult<AST.Program>} parseResult
   */
  createSourceCode(file, parseResult) {
    return new HTMLSourceCode({
      text: /**  @type {string} */ (file.body),
      ast: parseResult.ast,
      comments: parseResult.comments,
    });
  }
}

module.exports = {
  HTMLLanguage,
};
