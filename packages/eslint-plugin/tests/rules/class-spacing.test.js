const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/class-spacing");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("class-spacing", rule, {
  valid: [
    {
      code: `<button class="foo"></button>`,
    },
    {
      code: `<button class="foo bar"></button>`,
    },
    {
      code: `<button class="foo bar baz"></button>`,
    },
    {
      code: `<button class=""></button>`,
    },
    {
      code: `<button class></button>`,
    },
    {
      code: `<button id=" foo "></button>`,
    },
  ],
  invalid: [
    {
      code: `<button class=" foo"></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "extraSpacing",
        },
      ],
    },
    {
      code: `<button class="foo "></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "extraSpacing",
        },
      ],
    },
    {
      code: `<button class=" foo "></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "extraSpacing",
        },
        {
          messageId: "extraSpacing",
        },
      ],
    },
    {
      code: `<button class="  foo"></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "extraSpacing",
        },
      ],
    },
    {
      code: `<button class="foo  "></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "extraSpacing",
        },
      ],
    },
    {
      code: `<button class="foo  bar"></button>`,
      output: `<button class="foo bar"></button>`,
      errors: [
        {
          messageId: "extraSpacing",
        },
      ],
    },
    {
      code: `<button class="foo   bar"></button>`,
      output: `<button class="foo bar"></button>`,
      errors: [
        {
          messageId: "extraSpacing",
        },
      ],
    },
    {
      code: `<button class="foo  bar  baz"></button>`,
      output: `<button class="foo bar baz"></button>`,
      errors: [
        {
          messageId: "extraSpacing",
        },
        {
          messageId: "extraSpacing",
        },
      ],
    },
    {
      code: `<button class="  foo  bar  "></button>`,
      output: `<button class="foo bar"></button>`,
      errors: [
        {
          messageId: "extraSpacing",
        },
        {
          messageId: "extraSpacing",
        },
        {
          messageId: "extraSpacing",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] class-spacing", rule, {
  valid: [
    {
      code: "html`<div class='foo'></div>`",
    },
    {
      code: "html`<div class='foo bar'></div>`",
    },
    {
      code: "html`<div class=${' foo  bar '}></div>`",
    },
    {
      code: "html`<div class='${' foo  bar '} baz'></div>`",
    },
  ],
  invalid: [
    {
      code: `html\`<div class=' foo'></div>\``,
      output: `html\`<div class='foo'></div>\``,
      errors: [
        {
          messageId: "extraSpacing",
        },
      ],
    },
    {
      code: `html\`<div class='foo '></div>\``,
      output: `html\`<div class='foo'></div>\``,
      errors: [
        {
          messageId: "extraSpacing",
        },
      ],
    },
    {
      code: `html\`<div class='foo  bar'></div>\``,
      output: `html\`<div class='foo bar'></div>\``,
      errors: [
        {
          messageId: "extraSpacing",
        },
      ],
    },
  ],
});
