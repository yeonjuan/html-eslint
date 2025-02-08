import {
  parseForESLint
} from "@html-eslint/parser";
import plugin from "@html-eslint/eslint-plugin";
import {
  Linter as WebLinter
} from "@html-eslint/web-linter";
import {
  Language
} from "./language";

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
 * 
 * @typedef {Object} ParserOptions
 * @property {Record<string, string>} [ParserOptions.templateEngineSyntax]
 */

/**
 * @returns {RulesModules}
 */
function allRules() {
  return Object.entries(plugin.rules).reduce(
    (rules, [
      name,
      rule
    ]) => ({
      ...rules,
      [`@html-eslint/${name}`]: rule
    }),
    {}
  );
}

export class Linter {
  constructor() {
    /**
     * @type {ESLinter}
     */
    this._linter = new WebLinter({
      configType: "eslintrc"
    });

    /**
     * @type {RulesRecord}
     */
    this._rules = {
      "@html-eslint/indent": "error"
    };

    /**
     * @type {ParserOptions}
     */
    this._parserOptions = null;

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
    this._linter.defineParser(
      "@html-eslint/parser",
      {
        parseForESLint(code, options) {
          return parseForESLint(code, options);
        }
      }
    );
  }

  /**
   * @param {Language} language
   * @returns {string | undefined}
   */
  getParser(language) {
    if (language.value === "javascript") {
      return undefined;
    }
    return "@html-eslint/parser";
  }

  /**
   * Lints the given code and returns the result.
   * @param {string} code
   * @param {Language} language
   * @param {boolean?} fix
   * @returns {{messages: LintMessage[], output: string, fatalMessage?: LintMessage}}
   */
  lint(code, language, fix = false) {
    try {
      const parserOptions = language.value === "javascript" ? {
        ecmaVersion: "latest"
      } : this._parserOptions;
      const messages = this._linter.verify(
        code,
        {
          rules: this._rules,
          parser:  this.getParser(language),
          parserOptions,
        }
      );
      const {
        output
      } = this._linter.verifyAndFix(
        code,
        {
          rules: this._rules,
          parser: this.getParser(language),
          parserOptions,
        },
        {
          fix
        }
      );
      if (messages.length && messages[0].fatal) {
        console.error(messages[0]);
      }
      return {
        messages,
        output
      };
    } catch (error) {
      console.error(error);
      return {
        messages: [],
        output: "Error!"
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

  /**
   * @param {ParserOptions} parserOptions 
   */
  setParserOptions(parserOptions) {
    this._parserOptions = parserOptions;
  }
}
