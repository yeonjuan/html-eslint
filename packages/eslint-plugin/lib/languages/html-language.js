const { visitorKeys, parseForESLint } = require("@html-eslint/parser");
const { HTMLSourceCode } = require("./html-source-code");

/**
 * @typedef {import('@eslint/core').File} File
 * @typedef {import('@html-eslint/parser').ParserOptions} LanguageOptions
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
     * The visitor keys for the CSSTree AST.
     * @type {Record<string, string[]>}
     */
    this.visitorKeys = visitorKeys;
  }

  /**
   * @param {LanguageOptions} languageOptions
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
   * @param {LanguageOptions} context.languageOptions
   */
  parse(file, context) {
    const code = /**  @type {string} */ (file.body);
    const languageOptions = (context && context.languageOptions) || {};
    const result = parseForESLint(code, languageOptions);
    return {
      ok: true,
      ast: result.ast,
      comments: result.ast.comments,
    };
  }

  /**
   * @param {File} file
   * @param {any} parseResult
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
