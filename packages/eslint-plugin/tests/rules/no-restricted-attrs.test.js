const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-restricted-attrs");

const ruleTester = createRuleTester();

ruleTester.run("no-restricted-attrs", rule, {
  valid: [],
  invalid: [],
});
