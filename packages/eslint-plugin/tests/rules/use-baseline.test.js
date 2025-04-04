const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/use-baseline");

const ruleTester = createRuleTester();

ruleTester.run("use-baseline", rule, {
  valid: [
    {
      code: `<slot></slot>`,
    },
  ],
  invalid: [
    {
      code: `<slot></slot>`,
      errors: [
        {
          messageId: "notBaselineElement",
        },
      ],
      options: [
        {
          available: 2001,
        },
      ],
    },
  ],
});
