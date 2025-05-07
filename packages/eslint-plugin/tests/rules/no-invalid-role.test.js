const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-invalid-role");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-invalid-role", rule, {
  valid: [
    {
      code: "<div></div>",
    },
    {
      code: '<div role="grid"></div>',
    },
    {
      code: `<img role="presentation" alt="">`,
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
    {
      code: "<div role=''></div>",
      errors: [
        {
          messageId: "invalid",
        },
      ],
    },
    {
      code: "<button role='presentation'></button>",
      errors: [
        {
          messageId: "invalidPresentation",
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
    {
      code: `
const role = "grid";
html\`<div role="\${role}"></div>\``,
    },
  ],
  invalid: [
    {
      code: "html`<div role='foo'></div>`",
      errors: [
        {
          message: "Unexpected use of invalid role 'foo'",
        },
      ],
    },
    {
      code: "html`<button role='presentation'></button>`",
      errors: [
        {
          message: "Unexpected use of presentation role on <button>",
        },
      ],
    },
    {
      code: "html`<button role='none'></button>`",
      errors: [
        {
          message: "Unexpected use of presentation role on <button>",
        },
      ],
    },
  ],
});
