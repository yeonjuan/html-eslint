/** @import {Linter} from "eslint" */
const { RuleTester: ESLintRuleTester } = require("eslint");

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
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  });
};
