const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/{ruleName}");

const ruleTester = createRuleTester();

ruleTester.run("{ruleName}", rule, {
  valid: [],
  invalid: [],
});
