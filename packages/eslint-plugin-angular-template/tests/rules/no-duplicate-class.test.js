const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-class");

const ruleTester = createRuleTester();

ruleTester.run("no-duplicate-class", rule, {
  valid: [
    { code: `<div class="foo bar"></div>` },
    { code: `<div class="foo bar baz"></div>` },
    { code: `<div class="foo"></div>` },
    { code: `<div></div>` },
    { code: `<div [class]="expr"></div>` },
    { code: `<div [class.active]="isActive"></div>` },
    { code: `@if (show) { <div class="foo bar"></div> }` },
    { code: `@for (item of items; track item.id) { <li class="item"></li> }` },
  ],
  invalid: [
    {
      code: `<div class="foo foo"></div>`,
      errors: [
        {
          messageId: "duplicateClass",
          data: { className: "foo" },
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 20,
        },
      ],
      output: `<div class="foo "></div>`,
    },
    {
      code: `<div class="foo bar foo"></div>`,
      errors: [
        {
          messageId: "duplicateClass",
          data: { className: "foo" },
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 24,
        },
      ],
      output: `<div class="foo bar "></div>`,
    },
    {
      code: `<span class="a b a b"></span>`,
      errors: [
        {
          messageId: "duplicateClass",
          data: { className: "a" },
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 19,
        },
        {
          messageId: "duplicateClass",
          data: { className: "b" },
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 21,
        },
      ],
      output: `<span class="a b  "></span>`,
    },
    {
      code: `@if (show) { <div class="foo foo"></div> }`,
      errors: [
        {
          messageId: "duplicateClass",
          data: { className: "foo" },
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 33,
        },
      ],
      output: `@if (show) { <div class="foo "></div> }`,
    },
    {
      code: `
@for (item of items; track item.id) { <li class="item item"></li> }`,
      errors: [
        {
          messageId: "duplicateClass",
          data: { className: "item" },
          line: 2,
          column: 55,
          endLine: 2,
          endColumn: 59,
        },
      ],
      output: `
@for (item of items; track item.id) { <li class="item "></li> }`,
    },
  ],
});
