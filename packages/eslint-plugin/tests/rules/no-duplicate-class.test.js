const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-class");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-duplicate-class", rule, {
  valid: [
    {
      code: `<button class></button>`,
    },
    {
      code: `<button class=foo></button>`,
    },
    {
      code: `<button class="foo"></button>`,
    },
    {
      code: `<button class="foo foofoo"></button>`,
    },
    {
      code: `<button id="foo foo"></button>`,
    },
  ],
  invalid: [
    {
      code: `<button class="foo foo"></button>`,
      output: `<button class="foo "></button>`,
      errors: [
        {
          messageId: "duplicateClass",
          column: 20,
          endColumn: 23,
        },
      ],
    },
    {
      code: `<button class="foo   foo"></button>`,
      output: `<button class="foo   "></button>`,
      errors: [
        {
          messageId: "duplicateClass",
          column: 22,
          endColumn: 25,
        },
      ],
    },
    {
      code: `<button class="foo bar foo"></button>`,
      output: `<button class="foo bar "></button>`,
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    {
      code: `<button class="foo foo bar"></button>`,
      output: `<button class="foo  bar"></button>`,
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
    {
      code: `<button class=" foo foo bar "></button>`,
      output: `<button class=" foo  bar "></button>`,
      errors: [
        {
          messageId: "duplicateClass",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-duplicate class", rule, {
  valid: [
    {
      code: "html`<div class='foo'></div>`",
    },
    {
      code: "html`<div class=${' foo foo foo '}></div>`",
    },
  ],
  invalid: [
    {
      code: `
      html\`<div class='foo foo'></div>\`
      `,
      output: `
      html\`<div class='foo '></div>\`
      `,
      errors: [
        {
          messageId: "duplicateClass",
          column: 28,
          endColumn: 31,
        },
      ],
    },
  ],
});
