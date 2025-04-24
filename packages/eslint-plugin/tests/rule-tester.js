const { RuleTester: ESLintRuleTester } = require("eslint");
/**
 * @typedef {import("eslint").Linter.Config} Config
 * @typedef { import("../lib/types").RuleModule<any[]> } RuleModule
 */

const FILE_NAME = "test.html";
const html = require("../lib/index");

class RuleTester extends ESLintRuleTester {
  /**
   *
   * @param {Config} options
   */
  constructor(options) {
    super(options);
  }

  /**
   * @param {string} name
   * @param {RuleModule} rule
   * @param {{ valid: ESLintRuleTester.ValidTestCase[]; invalid: ESLintRuleTester.InvalidTestCase[];}} tests
   */
  // @ts-ignore
  run(name, rule, tests) {
    // @ts-ignore
    super.run(name, rule, {
      valid: tests.valid.map((test) => ({
        ...test,
        languageOptions:
          test.languageOptions && test.languageOptions.parserOptions
            ? test.languageOptions.parserOptions
            : {},
        filename: FILE_NAME,
      })),
      invalid: tests.invalid.map((test) => ({
        ...test,
        languageOptions:
          test.languageOptions && test.languageOptions.parserOptions
            ? test.languageOptions.parserOptions
            : {},
        filename: FILE_NAME,
      })),
    });
  }
}

/**
 * @param {"espree"} [parser]
 */
module.exports = function createRuleTester(parser) {
  if (!parser) {
    return new RuleTester({
      plugins: {
        // @ts-ignore
        html: html,
      },
      language: "html/html",
    });
  }

  return new RuleTester({
    languageOptions: !parser
      ? {
          parser: require("@html-eslint/parser"),
        }
      : {
          parserOptions: {
            ecmaVersion: 2015,
          },
        },
  });
};
