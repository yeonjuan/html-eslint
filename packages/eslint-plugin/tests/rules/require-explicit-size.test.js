const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-explicit-size");

const ruleTester = createRuleTester();

ruleTester.run("require-explicit-size", rule, {
  valid: [
    {
      code: `
<img width="200px" height="300px">
`,
    },
  ],
  invalid: [
    {
      code: `
  <img width="200px">
  `,

      errors: [
        {
          messageId: "missingHeight",
        },
      ],
    },
    {
      code: `
    <img height="200px">
    `,

      errors: [
        {
          messageId: "missingWidth",
        },
      ],
    },
    {
      code: `
      <img width="200px">
      `,

      errors: [
        {
          messageId: "missingHeight",
        },
      ],
    },
  ],
});
