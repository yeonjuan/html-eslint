const Linter = require("eslint").Linter;
const htmlParser = require("@html-eslint/parser");
const htmlPlugin = require("@html-eslint/eslint-plugin");
const SCOPE = "@html-eslint";

function createESLintConfig(config) {
  return {
    parser: "@html-eslint/parser",
    rules: config.rules,
  };
}

function getAllRules(plugin) {
  return Object.entries(plugin.rules).reduce((rules, [name, rule]) => {
    rules[`${SCOPE}/${name}`] = rule;
    return rules;
  }, {});
}

/**
 * @param {string} code
 * @param {object} rcConfig
 */
module.exports = function lint(code, config) {
  const linter = new Linter();
  const allRules = getAllRules(htmlPlugin);
  const eslintConfig = createESLintConfig(config);

  linter.defineParser(`${SCOPE}/parser`, htmlParser);
  linter.defineRules(allRules);

  return linter.verify(code, eslintConfig);
};
