import {
  INITAIL_CONFIG,
  INITIAL_HTML,
  INITIAL_JAVASCRIPT,
  getInitialCode
} from "./helpers";
import {Language} from "./language";
import {Linter} from "./linter";

/**
 * @typedef {import("eslint").Linter.LintMessage} LintMessage
 * @typedef {"lint" | "changeLanguage"} EventType
 * @typedef {import("./language").Language} Language
 * @typedef {import("./linter").RulesRecord} RulesRecord
 */

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
    this.html = "";

    /**
     * @member
     * @type {string}
     */
    this.javascript = "";

    /**
     * @member
     * @type {RulesRecord}
     */
    this.rules = {};

    /**
     * @member
     * @type {LintMessage[]}
     */
    this.messages = [];

    /**
     * @member
     * @type {Language}
     */
    this.language = new Language("html");

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
      changeLanguage: new Set()
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

  setCode(code) {
    if (this.language.value === "html") {
      this.html = code;
    } else {
      this.javascript = code;
    }
  }

  getCode() {
    if (this.language.value === "html") {
      return this.html;
    } else {
      return this.javascript;
    }
  }

  /**
   * @param {Language} language
   */
  setLanguage(language) {
    if (this.language.value === language) {
      return;
    }
    this.language = new Language(language);
    if (!this.getCode()) {
      this.setCode(getInitialCode(this.language.value));
    }
    this.notify("changeLanguage");
  }

  /**
   * @param {string} code
   * @param {RulesRecord} rules
   */
  lint() {
    this.linter.setRules(this.rules);
    const {messages, output} = this.linter.lint(
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
   * @returns {string}
   */
  toHash() {
    const hash = window.btoa(unescape(encodeURIComponent(JSON.stringify({
      code: this.getCode(),
      config: {rules: this.rules},
      language: this.language.value
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
      if (parsed.language === "javascript") {
        this.setLanguage(parsed.language);
        if (typeof parsed.code === "string" && parsed.code) {
          this.setCode(parsed.code);
        } else {
          this.html = INITIAL_HTML;
          this.javascript = INITIAL_JAVASCRIPT;
        }
      } else {
        this.setLanguage("html");
        if (typeof parsed.code === "string" && parsed.code) {
          this.setCode(parsed.code);
        } else {
          this.html = INITIAL_HTML;
          this.javascript = INITIAL_JAVASCRIPT;
        }
      }
      if (
        parsed.config &&
        typeof parsed.config === "object" &&
        parsed.config.rules &&
        typeof parsed.config.rules === "object"
      ) {
        this.setRules(parsed.config.rules);
      } else {
        this.setRules(JSON.parse(INITAIL_CONFIG).rules);
      }
    } catch (error) {
      console.error(error);
      this.javascript = INITIAL_JAVASCRIPT;
      this.setLanguage("html");
      this.setCode(INITIAL_HTML);
      this.setRules(JSON.parse(INITAIL_CONFIG).rules);
    }
  }
}
