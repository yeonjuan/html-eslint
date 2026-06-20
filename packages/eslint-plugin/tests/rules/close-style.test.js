const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/close-style");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("close-style", rule, {
  valid: [
    {
      code: ``,
    },
  ],
  invalid: [],
});

templateRuleTester.run("[template] close-style", rule, {
  valid: [
    {
      code: ``,
    },
  ],
  invalid: [],
});
