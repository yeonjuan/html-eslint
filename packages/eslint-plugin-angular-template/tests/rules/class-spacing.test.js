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
      errors: [{ messageId: "extraSpacingStart" }],
    },
    {
      code: `<div class="foo "></div>`,
      output: `<div class="foo"></div>`,
      errors: [{ messageId: "extraSpacingEnd" }],
    },
    {
      code: `<div class="  foo"></div>`,
      output: `<div class="foo"></div>`,
      errors: [{ messageId: "extraSpacingStart" }],
    },
    {
      code: `<div class="foo  "></div>`,
      output: `<div class="foo"></div>`,
      errors: [{ messageId: "extraSpacingEnd" }],
    },
    {
      code: `<div class="foo  bar"></div>`,
      output: `<div class="foo bar"></div>`,
      errors: [{ messageId: "extraSpacingBetween" }],
    },
    {
      code: `<div class="foo   bar"></div>`,
      output: `<div class="foo bar"></div>`,
      errors: [{ messageId: "extraSpacingBetween" }],
    },
    {
      code: `<div class="  foo  bar  "></div>`,
      output: `<div class="foo bar"></div>`,
      errors: [{ messageId: "extraSpacingStart" }],
    },
    {
      code: `@if (show) { <div class=" foo"></div> }`,
      output: `@if (show) { <div class="foo"></div> }`,
      errors: [{ messageId: "extraSpacingStart" }],
    },
    {
      code: `@for (item of items; track item.id) { <li class="item  item2"></li> }`,
      output: `@for (item of items; track item.id) { <li class="item item2"></li> }`,
      errors: [{ messageId: "extraSpacingBetween" }],
    },
  ],
});
