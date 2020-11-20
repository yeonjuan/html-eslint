const { RuleTester: ESLintRuleTester } = require("eslint");

class RuleTester extends ESLintRuleTester {
  constructor(options) {
    super(options);
  }
}

module.exports = function createRuleTester() {
  return new RuleTester({
    parser: require.resolve("@html-eslint/parser"),
  });
};
