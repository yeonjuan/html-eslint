import { Linter } from "./linter";

/**
 * @typedef {import("eslint").Linter.LintMessage} LintMessage
 * @typedef {"lint"} EventType
 * @typedef {"html" | "js"} Language
 * @typedef {import("./linter").RulesRecord} RulesRecord
 */

export class Model {
  /**
   * @param {Language} language
   */
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
    this.language = "html";

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
   * @param {string} code
   */
  setCode(code) {
    this.code = code;
  }

  /**
   * @param {string} code
   * @param {RulesRecord} rules
   */
  lint() {
    this.linter.setRules(this.rules);
    const { messages, output } = this.linter.lint(this.code, true);
    this.fixed = output;
    this.messages = messages;
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
    const hash = window.btoa(
      unescape(
        encodeURIComponent(
          JSON.stringify({ code: this.code, config: this.rules })
        )
      )
    );
    return hash;
  }
}
