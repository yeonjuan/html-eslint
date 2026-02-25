/** @import {Linter} from "eslint" */
const { RuleTester: ESLintRuleTester } = require("eslint");
const parser = require("@angular-eslint/template-parser");

class RuleTester extends ESLintRuleTester {
  /** @param {Linter.Config} options */
  constructor(options) {
    super(options);
  }

  /**
   * @param {string} name
   * @param {any} rule
   * @param {{
   *   valid: ESLintRuleTester.ValidTestCase[];
   *   invalid: ESLintRuleTester.InvalidTestCase[];
   * }} tests
   */
  run(name, rule, tests) {
    super.run(name, rule, tests);
  }
}

module.exports = function createRuleTester() {
  return new RuleTester({
    languageOptions: {
      parser,
    },
  });
};
