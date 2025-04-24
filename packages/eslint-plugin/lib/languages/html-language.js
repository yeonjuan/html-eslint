/**
 * @typedef {import('@eslint/core').File} File
 */
const { visitorKeys, parseForESLint } = require("@html-eslint/parser");
const { HTMLSourceCode } = require("./html-source-code");
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

  validateLanguageOptions() {}

  /**
   * @param {File} file
   */
  parse(file) {
    const code = /**  @type {string} */ (file.body);
    const result = parseForESLint(code, {});
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
