import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/{ruleName}.js";

const ruleTester = createRuleTester();

ruleTester.run("{ruleName}", rule, {
  valid: [],
  invalid: [],
});
