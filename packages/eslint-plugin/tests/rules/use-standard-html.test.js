const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/use-standard-html");

const ruleTester = createRuleTester();

ruleTester.run("use-standard-html", rule, {
  valid: [
    {
      code: `<slot></slot>`,
    },
  ],
  invalid: [],
});
