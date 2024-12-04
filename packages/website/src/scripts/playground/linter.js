import { parseForESLint } from "@html-eslint/parser";
import plugin from "@html-eslint/eslint-plugin";
import { Linter as WebLinter } from "@html-eslint/web-linter";

/**
 * @typedef {import("eslint").Linter} ESLinter;
 * @typedef {import("eslint").Rule.RuleModule } RuleModule
 * @typedef {import("eslint").Linter.RulesRecord} RulesRecord
 * @typedef {import('eslint').Linter.LintMessage} LintMessage
 * @typedef {import('eslint').Linter.LintMessage} LintMessage
 * @typedef {Object.<string, RuleModule>} RulesModules
 *
 * @callback OnChangeHadnler
 * @param {{ messages: LintMessage[], output: string }}
 * @returns {void}
 *
 * @callback OnErrorHhandler
 * @param {Error}
 * @returns {void}
 */

/**
 * @returns {RulesModules}
 */
function allRules() {
  return Object.entries(plugin.rules).reduce(
    (rules, [name, rule]) => ({
      ...rules,
      [`@html-eslint/${name}`]: rule,
    }),
    {}
  );
}

export class Linter {
  constructor() {
    /**
     * @type {ESLinter}
     */
    this._linter = new WebLinter();
    /**
     * @type {RulesRecord}
     */
    this._rules = {
      "@html-eslint/indent": "error",
    };
    this._defineParser();
    this._defineRules();
  }

  /**
   * @private
   */
  _defineRules() {
    this._linter.defineRules(allRules());
  }

  /**
   * @private
   */
  _defineParser() {
    this._linter.defineParser("@html-eslint/parser", {
      parseForESLint(code) {
        return parseForESLint(code);
      },
    });
  }

  getParser(language) {
    if (language === "js") {
      return undefined;
    }
    return "@html-eslint/parser";
  }

  /**
   * Lints the given code and returns the result.
   * @param {string} code
   * @param {string} language
   * @param {boolean?} fix
   * @returns {{messages: LintMessage[], output: string, fatalMessage?: LintMessage}}
   */
  lint(code, language, fix = false) {
    try {
      let fatalMessage;
      const messages = this._linter.verify(code, {
        parser: this.getParser(language),
        rules: this._rules,
        parserOptions: {
          ecmaVersion: "latest",
        },
      });
      const { output } = this._linter.verifyAndFix(
        code,
        {
          parser: this.getParser(language),
          rules: this._rules,
        },
        { fix }
      );
      if (messages.length && messages[0].fatal) {
        fatalMessage = messages[0];
      }
      return { messages, output };
    } catch (error) {
      console.error(error);
      return {
        messages: [],
        output: "Error!",
      };
    }
  }

  /**
   * Change rules configuration.
   * @param {RulesRecord} rules
   */
  setRules(rules) {
    this._rules = rules;
  }
}
