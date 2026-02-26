import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/class-spacing.js";

const ruleTester = createRuleTester();

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
    {
      code: `<button class:active={isActive}></button>`,
    },
    {
      code: `<button class="foo {bar}"></button>`,
    },
    {
      code: `<div class="container"></div>`,
    },
    {
      code: `<div class={["foo", "bar"]}></div>`,
    },
  ],
  invalid: [
    {
      code: `<button class=" foo"></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "extraSpacingStart",
        },
      ],
    },
    {
      code: `<button class="foo "></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "extraSpacingEnd",
        },
      ],
    },
    {
      code: `<button class=" foo "></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "extraSpacingStart",
        },
      ],
    },
    {
      code: `<button class="  foo"></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "extraSpacingStart",
        },
      ],
    },
    {
      code: `<button class="foo  "></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "extraSpacingEnd",
        },
      ],
    },
    {
      code: `<button class="foo  bar"></button>`,
      output: `<button class="foo bar"></button>`,
      errors: [
        {
          messageId: "extraSpacingBetween",
        },
      ],
    },
    {
      code: `<button class="foo   bar"></button>`,
      output: `<button class="foo bar"></button>`,
      errors: [
        {
          messageId: "extraSpacingBetween",
        },
      ],
    },
    {
      code: `<button class="foo  bar  baz"></button>`,
      output: `<button class="foo bar baz"></button>`,
      errors: [
        {
          messageId: "extraSpacingBetween",
        },
      ],
    },
    {
      code: `<button class="  foo  bar  "></button>`,
      output: `<button class="foo bar"></button>`,
      errors: [
        {
          messageId: "extraSpacingStart",
        },
      ],
    },
    {
      code: `<div class=" container  wrapper "></div>`,
      output: `<div class="container wrapper"></div>`,
      errors: [
        {
          messageId: "extraSpacingStart",
        },
      ],
    },
    {
      code: `<div class={["foo  bar"]}></div>`,
      output: `<div class={["foo bar"]}></div>`,
      errors: [
        {
          messageId: "extraSpacingBetween",
        },
      ],
    },
  ],
});
