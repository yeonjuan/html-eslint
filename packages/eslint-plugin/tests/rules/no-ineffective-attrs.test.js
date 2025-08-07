const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-ineffective-attrs");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-ineffective-attrs", rule, {
  valid: [],
  invalid: [],
});

templateRuleTester.run("[template] no-ineffective-attrs", rule, {
  valid: [],
  invalid: [],
});
