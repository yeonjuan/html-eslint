const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-class");

const ruleTester = createRuleTester();

ruleTester.run("no-duplicate-class", rule, {
  valid: [
    {
      code: `<button class></button>`,
    },
    {
      code: `<button class="foo"></button>`,
    },
  ],
  invalid: [
    {
      code: `<button class="foo foo"></button>`,
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
  ],
});
