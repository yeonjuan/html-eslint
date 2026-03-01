import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/no-duplicate-class.js";

const ruleTester = createRuleTester();

ruleTester.run("no-duplicate-class", rule, {
  valid: [
    {
      code: `<button class="foo"></button>`,
    },
    {
      code: `<button class="foo bar"></button>`,
    },
    {
      code: `<button class="foo foofoo"></button>`,
    },
    {
      code: `<button id="foo foo"></button>`,
    },
    {
      code: `<button class></button>`,
    },
    {
      code: `<button class={foo}></button>`,
    },
    {
      code: `<button class="foo {bar}"></button>`,
    },
  ],
  invalid: [
    {
      code: `<button class="foo foo"></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "duplicateClass",
          line: 1,
          column: 20,
          endColumn: 23,
        },
      ],
    },
    {
      code: `<button class="foo   foo"></button>`,
      output: `<button class="foo"></button>`,
      errors: [
        {
          messageId: "duplicateClass",
          line: 1,
          column: 22,
          endColumn: 25,
        },
      ],
    },
    {
      code: `<button class="foo bar foo"></button>`,
      output: `<button class="foo bar"></button>`,
      errors: [
        {
          messageId: "duplicateClass",
          line: 1,
          column: 24,
          endColumn: 27,
        },
      ],
    },
    {
      code: `<button class="foo foo bar"></button>`,
      output: `<button class="foo bar"></button>`,
      errors: [
        {
          messageId: "duplicateClass",
          line: 1,
          column: 20,
          endColumn: 23,
        },
      ],
    },
    {
      code: `<button class=" foo foo bar "></button>`,
      output: `<button class=" foo bar "></button>`,
      errors: [
        {
          messageId: "duplicateClass",
          line: 1,
          column: 21,
          endColumn: 24,
        },
      ],
    },
  ],
});
