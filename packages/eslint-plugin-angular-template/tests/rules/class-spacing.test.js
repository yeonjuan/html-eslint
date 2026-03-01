const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/class-spacing");

const ruleTester = createRuleTester();

ruleTester.run("class-spacing", rule, {
  valid: [
    { code: `<div class="foo"></div>` },
    { code: `<div class="foo bar"></div>` },
    { code: `<div class="foo bar baz"></div>` },
    { code: `<div class=""></div>` },
    { code: `<div [class]="expr"></div>` },
    { code: `<div [class.active]="isActive"></div>` },
    { code: `@if (show) { <div class="foo bar"></div> }` },
    { code: `@for (item of items; track item.id) { <li class="item"></li> }` },
  ],
  invalid: [
    {
      code: `<div class=" foo"></div>`,
      output: `<div class="foo"></div>`,
      errors: [
        {
          messageId: "extraSpacing",
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 15,
        },
      ],
    },
    {
      code: `<div class="foo "></div>`,
      output: `<div class="foo"></div>`,
      errors: [
        {
          messageId: "extraSpacing",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 17,
        },
      ],
    },
    {
      code: `<div class="  foo"></div>`,
      output: `<div class="foo"></div>`,
      errors: [
        {
          messageId: "extraSpacing",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 17,
        },
      ],
    },
    {
      code: `<div class="foo  "></div>`,
      output: `<div class="foo"></div>`,
      errors: [
        {
          messageId: "extraSpacing",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 18,
        },
      ],
    },
    {
      code: `<div class="foo  bar"></div>`,
      output: `<div class="foo bar"></div>`,
      errors: [
        {
          messageId: "extraSpacing",
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 18,
        },
      ],
    },
    {
      code: `<div class="foo   bar"></div>`,
      output: `<div class="foo bar"></div>`,
      errors: [
        {
          messageId: "extraSpacing",
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 19,
        },
      ],
    },
    {
      code: `<div class="  foo  bar  "></div>`,
      output: `<div class="foo bar"></div>`,
      errors: [
        {
          messageId: "extraSpacing",
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 17,
        },
        {
          messageId: "extraSpacing",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 22,
        },
        {
          messageId: "extraSpacing",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 25,
        },
      ],
    },
    {
      code: `@if (show) { <div class=" foo"></div> }`,
      output: `@if (show) { <div class="foo"></div> }`,
      errors: [
        {
          messageId: "extraSpacing",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 28,
        },
      ],
    },
    {
      code: `@for (item of items; track item.id) { <li class="item  item2"></li> }`,
      output: `@for (item of items; track item.id) { <li class="item item2"></li> }`,
      errors: [
        {
          messageId: "extraSpacing",
          line: 1,
          column: 55,
          endLine: 1,
          endColumn: 56,
        },
      ],
    },
  ],
});
