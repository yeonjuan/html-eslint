const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/{ruleName}");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("{ruleName}", rule, {
  valid: [],
  invalid: [],
});

templateRuleTester.run("[template] {ruleName}", rule, {
  valid: [],
  invalid: [],
});
