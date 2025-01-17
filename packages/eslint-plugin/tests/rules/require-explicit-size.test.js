const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-explicit-size");

const ruleTester = createRuleTester();

ruleTester.run("require-explicit-size", rule, {
  valid: [
    {
      code: "<div></div>",
    },
    {
      code: `<img width="200px" height="300px">`,
    },
    {
      code: `<img class="size" width="200px">`,
      options: [
        {
          allowClass: ["size"],
        },
      ],
    },
    {
      code: `<img id="foo">`,
      options: [
        {
          allowClass: ["foo"],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `<img width="200px">`,
      errors: [
        {
          messageId: "missingHeight",
        },
      ],
    },
    {
      code: `<img height="200px">`,
      errors: [
        {
          messageId: "missingWidth",
        },
      ],
    },
    {
      code: `<img width="200px">`,
      errors: [
        {
          messageId: "missingHeight",
        },
      ],
    },
    {
      code: `<img class="foo" width="200px">`,
      errors: [
        {
          messageId: "missingHeight",
        },
      ],
      options: [
        {
          allowClass: ["size"],
        },
      ],
    },
  ],
});
