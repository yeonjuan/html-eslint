const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-form-method");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("require-form-method", rule, {
  valid: [],
  invalid: [],
});

templateRuleTester.run("[template] require-form-method", rule, {
  valid: [],
  invalid: [],
});
