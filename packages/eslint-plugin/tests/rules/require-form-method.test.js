const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-form-method");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("require-form-method", rule, {
  valid: [
    {
      code: "<div></div>",
    },
    {
      code: '<form method="POST"></form>',
    },
    {
      code: '<form method="post"></form>',
    },
    {
      code: '<form method="GET"></form>',
    },
    {
      code: '<form method="get"></form>',
    },
    {
      code: '<form method="DIALOG"></form>',
    },
    {
      code: '<form method="dialog"></form>',
    },
  ],
  invalid: [
    {
      code: "<form></form>",
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: "<form method></form>",
      errors: [
        {
          messageId: "missingValue",
        },
      ],
    },
    {
      code: "<form method='other'></form>",
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] require-form-method", rule, {
  valid: [
    {
      code: "html`<div></div>`",
    },
    {
      code: "html`<form method='GET'></form>`",
    },
    {
      code: 'html`<form method="${METHOD}"></form>`',
    },
  ],
  invalid: [
    {
      code: "html`<form method='other'></form>`",
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
