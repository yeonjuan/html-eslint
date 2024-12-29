const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-invalid-role");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-invalid-role", rule, {
  valid: [
    {
      code: '<div role="grid"></div>',
    },
  ],
  invalid: [
    {
      code: "<div role='foo'></div>",
      errors: [
        {
          messageId: "invalid",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-invalid-role", rule, {
  valid: [
    {
      code: 'html`<div role="grid"></div>`',
    },
  ],
  invalid: [
    {
      code: "html`<div role='foo'></div>`",
      errors: [
        {
          messageId: "invalid",
        },
      ],
    },
  ],
});
