const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-input-label");

const ruleTester = createRuleTester();

ruleTester.run("require-input-label", rule, {
  valid: [
    {
      code: `<input id="foo"></input>`,
    },
  ],
  invalid: [],
});
