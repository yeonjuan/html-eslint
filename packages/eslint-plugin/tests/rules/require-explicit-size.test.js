const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-explicit-size");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("require-explicit-size", rule, {
  valid: [
    {
      code: "<div></div>",
    },
    {
      code: `<img width="200px" height="300px">`,
    },
    {
      code: `<iframe width="200px" height="300px">`,
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
          allowId: ["foo"],
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
      code: `<iframe></iframe>`,
      errors: [
        {
          messageId: "missingHeight",
        },
        {
          messageId: "missingWidth",
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

templateRuleTester.run("[template] require-explicit-size", rule, {
  valid: [
    {
      code: "html`<div></div>`",
    },
    {
      code: 'html`<img width="200px" height="200px">`',
    },
    {
      code: 'html`<img width="200px" class="size">`',
      options: [
        {
          allowClass: ["size"],
        },
      ],
    },
    {
      code: 'html`<img id="size">`',
      options: [
        {
          allowId: ["size"],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `html\`<img width="200px">\``,
      errors: [
        {
          messageId: "missingHeight",
        },
      ],
    },
    {
      code: `html\`<iframe width="200px">\``,
      errors: [
        {
          messageId: "missingHeight",
        },
      ],
    },
  ],
});
