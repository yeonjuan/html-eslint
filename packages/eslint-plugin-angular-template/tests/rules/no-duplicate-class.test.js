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
      errors: [{ messageId: "duplicateClass", data: { class: "foo" } }],
      output: `<div class="foo"></div>`,
    },
    {
      code: `<div class="foo bar foo"></div>`,
      errors: [{ messageId: "duplicateClass", data: { class: "foo" } }],
      output: `<div class="foo bar"></div>`,
    },
    {
      code: `<span class="a b a b"></span>`,
      errors: [
        { messageId: "duplicateClass", data: { class: "a" } },
        { messageId: "duplicateClass", data: { class: "b" } },
      ],
      output: `<span class="a b b"></span>`,
    },
    {
      code: `@if (show) { <div class="foo foo"></div> }`,
      errors: [{ messageId: "duplicateClass", data: { class: "foo" } }],
      output: `@if (show) { <div class="foo"></div> }`,
    },
    {
      code: `@for (item of items; track item.id) { <li class="item item"></li> }`,
      errors: [{ messageId: "duplicateClass", data: { class: "item" } }],
      output: `@for (item of items; track item.id) { <li class="item"></li> }`,
    },
  ],
});
