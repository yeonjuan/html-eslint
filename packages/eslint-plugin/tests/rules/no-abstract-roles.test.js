const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-abstract-roles");

const ruleTester = createRuleTester();

ruleTester.run("id-naming-convention", rule, {
  valid: [
    {
      code: `<div role="any"> </div>`,
    },
  ],
  invalid: [
    {
      code: `<img role="command">`,
      errors: [
        {
          message: "Unexpected use of an abstract role.",
        },
      ],
    },
  ],
});
