const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-closing-tags");

const ruleTester = createRuleTester();

ruleTester.run("require-closing-tags", rule, {
  valid: [
    {
      code: `<div></div>`,
    },
    {
      code: `<img>`,
    },
  ],
  invalid: [
    {
      code: `<div>`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: `<img>`,
      output: `<img />`,
      options: [
        {
          selfClosing: "always",
        },
      ],
      errors: [
        {
          messageId: "missingSelf",
        },
      ],
    },
    {
      code: `<img />`,
      output: `<img >`,
      options: [
        {
          selfClosing: "never",
        },
      ],
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
