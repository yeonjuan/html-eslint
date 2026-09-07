import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/no-restricted-attrs.js";

const ruleTester = createRuleTester();

ruleTester.run("no-restricted-attrs", rule, {
  valid: [
    {
      code: "<div></div>",
      options: [{ tagPatterns: [".*"], attrPatterns: ["data-.*"] }],
    },
    {
      code: '<img src="foo.png" />',
      options: [{ tagPatterns: ["div"], attrPatterns: ["src"] }],
    },
    {
      code: '<div class="foo"></div>',
      options: [{ tagPatterns: ["div"], attrPatterns: ["data-.*"] }],
    },
    // Svelte directives should be skipped (NullAttributeAdapter - key is null)
    {
      code: "<div on:click={handler}></div>",
      options: [{ tagPatterns: [".*"], attrPatterns: ["on:click"] }],
    },
  ],
  invalid: [
    {
      code: '<div data-x="1"></div>',
      options: [{ tagPatterns: [".*"], attrPatterns: ["data-.*"] }],
      errors: [
        {
          messageId: "restricted",
          line: 1,
          column: 6,
          data: { attr: "data-x" },
        },
      ],
    },
    {
      code: '<img alt="foo" />',
      options: [
        {
          tagPatterns: ["img"],
          attrPatterns: ["^alt$"],
          message: "no alt in img",
        },
      ],
      errors: [{ message: "no alt in img", line: 1, column: 6 }],
    },
  ],
});
