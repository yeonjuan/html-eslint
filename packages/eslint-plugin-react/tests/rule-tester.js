const { RuleTester } = require("eslint");

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
