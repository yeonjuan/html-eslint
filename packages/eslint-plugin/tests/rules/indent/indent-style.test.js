const { wrongIndentErrors } = require("./helpers");
const createRuleTester = require("../../rule-tester");
const rule = require("../../../lib/rules/indent");

const ruleTester = createRuleTester();

ruleTester.run("indent-style", rule, {
  valid: [
    {
      code: `<button class="foo"></button>`,
    },
  ],
  invalid: [
    {
      code: `<html>
  <style>
.foo {}
  </style>
</html>`,
      output: `<html>
  <style>
    .foo {}
  </style>
</html>
`,
      errors: wrongIndentErrors(1),
      options: [2],
    },
  ],
});
