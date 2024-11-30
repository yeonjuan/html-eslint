const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-button-type");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("require-button-type", rule, {
  valid: [
    {
      code: `<button type="submit">Submit Button</button>`,
    },
    {
      code: `<button type="button">Button</button>`,
    },
    {
      code: `<button type="reset">Reset Button</button>`,
    },
  ],
  invalid: [
    {
      code: `<button>Missing type</button>`,
      errors: [
        {
          messageId: "missing",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: `<button type="invalid">Invalid type</button>`,
      errors: [
        {
          message: '"invalid" is an invalid value for button type attribute.',
          line: 1,
          column: 9,
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] require-button-type", rule, {
  valid: [
    {
      code: 'html`<button type="submit">Submit Button</button>`',
    },
    {
      code: 'html`<button type="${type}">Submit Button</button>`',
    },
  ],
  invalid: [
    {
      code: "html`<button>Missing type</button>`",
      errors: [
        {
          messageId: "missing",
          line: 1,
          column: 6,
        },
      ],
    },
  ],
});
