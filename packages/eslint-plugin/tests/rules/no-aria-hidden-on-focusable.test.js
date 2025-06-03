const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-aria-hidden-on-focusable");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-aria-hidden-on-focusable", rule, {
  valid: [
    {
      code: `<div aria-hidden="true"></div>`,
    },
    {
      code: `<img aria-hidden="true">`,
    },
    {
      code: `<a aria-hidden="false" href="#"></a>`,
    },
    {
      code: `<button aria-hidden="true" tabindex="-1"></button>`,
    },
    {
      code: `<a href="/"></a>`,
    },
    {
      code: `<div aria-hidden="true"><a href="#"></a></div>`,
    },
  ],
  invalid: [
    {
      code: `<div aria-hidden="true" tabindex="0"></div>`,
      errors: [
        {
          message: 'Unexpected aria-hidden="true" on focusable element.',
        },
      ],
    },
    {
      code: `<input aria-hidden="true">`,
      errors: [
        {
          message: 'Unexpected aria-hidden="true" on focusable element.',
        },
      ],
    },
    {
      code: `<a href="/" aria-hidden="true"></a>`,
      errors: [
        {
          message: 'Unexpected aria-hidden="true" on focusable element.',
        },
      ],
    },
    {
      code: `<button aria-hidden="true"></button>`,
      errors: [
        {
          message: 'Unexpected aria-hidden="true" on focusable element.',
        },
      ],
    },
    {
      code: `<textarea aria-hidden="true"></textarea>`,
      errors: [
        {
          message: 'Unexpected aria-hidden="true" on focusable element.',
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-aria-hidden-on-focusable", rule, {
  valid: [
    {
      code: `html\`<div aria-hidden="true"></div>\``,
    },
    {
      code: `html\`<button aria-hidden="true" tabindex="-1"></button>\``,
    },
  ],
  invalid: [
    {
      code: `html\`<button aria-hidden="true"></button>\``,
      errors: [
        {
          message: 'Unexpected aria-hidden="true" on focusable element.',
        },
      ],
    },
  ],
});
