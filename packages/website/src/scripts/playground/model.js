/**
 * @import eslint from "eslint";
 * @import {Language} from "./languages/types";
 * @import {RulesRecord, ParserOptions} from "./linter";
 * @typedef {"lint" | "changeLanguage" | "autofixed"} EventType
 */

import {
  createLanguage,
} from "./languages";
import {
  Linter
} from "./linter";

export class Model {
  constructor() {
    /**
     * @member
     * @type {string}
     */
    this.fixed = "";

    /**
     * @member
     * @type {string}
     */
    this.code = "";
   

    /**
     * @member
     * @type {RulesRecord}
     */
    this.rules = null;

    /**
     * @member
     * @type {ParserOptions}
     */
    this.parserOptions = null;

    /**
     * @member
     * @type {eslint.Linter.LintMessage[]}
     */
    this.messages = [];

    /**
     * @member
     * @type {Language}
     */
    this.language = createLanguage("html");


    this.cache = {
      html: {
        code: "",
        config: {
          rules: null
        }
      },
      javascript: {
        code: "",
        config: {
          rules: null
        }
      },
      jsx: {
        code: "",
        config: {
          rules: null
        }
      },
    }

    /**
     * @member
     * @type {Linter}
     */
    this.linter = new Linter();

    /**
     * @member
     * @private
     */
    this.observers = {
      lint: new Set(),
      changeLanguage: new Set(),
      autofixed: new Set()
    };
  }

  /**
   * @param {StateEventType} type
   * @param {() => void} observer
   */
  on(type, observer) {
    this.observers[type].add(observer);
  }

  /**
   * @param {RulesRecord} rules
   */
  setRules(rules) {
    this.rules = rules;
  }

  /**
   * @param {ParserOptions} parserOptions 
   */
  setParserOptions(parserOptions) {
    this.parserOptions = parserOptions;
  }

  setCode(code) {
    this.code = code;
  }

  getCode() {
    return this.code;
  }

  /**
   * @param {"html" | "jsx" | "javascript"} language
   */
  setLanguage(language) {
    this.cache[this.language.key] = {
      code: this.code,
      config:{
        rules: this.rules,
      }
    } 
    this.language = createLanguage(language);
    this.setCode(
      this.cache[language].code || 
      this.language.initialCode
    );
  
    this.setRules(
      this.cache[language].config.rules || 
      this.language.initialConfig.rules
    )
    this.notify("changeLanguage");
  }

  /**
   * @param {string} code
   * @param {RulesRecord} rules
   */
  lint() {
    this.linter.setRules(this.rules);
    this.linter.setParserOptions(this.parserOptions);
    const {
      messages, output
    } = this.linter.lint(
      this.getCode(),
      this.language,
      true
    );
    this.fixed = output;
    this.messages = messages || [];
    this.notify("lint");
  }

  /**
   * @private
   * @param {EventType} type
   */
  notify(type) {
    this.observers[type].forEach((observer) => observer());
  }

  /**
   *
   * @param {LintMessage} message
   */
  applyFix(message) {
    const {
      fix
    } = message;
    if (fix) {
      const code = this.getCode();
      const [start, end] = fix.range;
      const fixed = code.slice(0, start) +
        fix.text +
        code.slice(end);
      this.setCode(fixed);
      this.lint();
      this.notify('autofixed');
    }
  }
  
  applySuggestion(message) {
    const {
      suggestions 
    } = message;
    if (suggestions && suggestions.length > 0) {
      const suggestion = suggestions[0];
      if (suggestion.fix) {
        const code = this.getCode();
        const [start, end] = suggestion.fix.range;
        const fixed = code.slice(0, start) +
          suggestion.fix.text +
          code.slice(end);
        this.setCode(fixed);
        this.lint();
        this.notify('autofixed');
      }
    }
  }
  /**
   * @returns {string}
   */
  toHash() {
    const hash = window.btoa(unescape(encodeURIComponent(JSON.stringify({
      code: this.getCode(),
      config: {
        rules: this.rules,
        parserOptions: this.parserOptions || undefined,
      },
      language: this.language.key
    }))));
    return hash;
  }

  /**
   * @param {string}
   */
  load(str) {
    try {
      const parsed = JSON.parse(str);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("empty parsed");
      }
      this.setLanguage(parsed.language);
      this.setCode(parsed.code);

      const hasConfig = parsed.config &&
        typeof parsed.config === "object";
      const hasRule = hasConfig && parsed.config.rules &&
        typeof parsed.config.rules === "object";
      if (hasRule) {
        this.setRules(parsed.config.rules);
      } 
    } catch (error) {
      this.setLanguage("html");
    }
  }
}
