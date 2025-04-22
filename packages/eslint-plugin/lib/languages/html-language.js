/**
 * @typedef {import('@eslint/core').File} File
 */
const { visitorKeys, parseForESLint } = require("@html-eslint/parser");

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
    /**
     * @type {string}
     */
    // @ts-ignore
    const code = file.body;
    const result = parseForESLint(code, {});
    return {
      ok: true,
      ast: result.ast,
    };
  }

  /**
   *
   * @param {File} file
   */
  createSourceCode(file) {}
}

module.exports = {
  HTMLLanguage,
};
