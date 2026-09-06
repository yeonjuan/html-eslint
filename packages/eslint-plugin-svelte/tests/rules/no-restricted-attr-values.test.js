import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/no-restricted-attr-values.js";

const ruleTester = createRuleTester();

ruleTester.run("no-restricted-attr-values", rule, {
  valid: [
    {
      code: "<div></div>",
      options: [{ attrPatterns: [".*"], attrValuePatterns: ["data-.*"] }],
    },
    {
      code: '<div class="foo"></div>',
      options: [{ attrPatterns: ["class"], attrValuePatterns: ["data-.*"] }],
    },
  ],
  invalid: [
    {
      code: '<div foo="data-x"></div>',
      options: [{ attrPatterns: [".*"], attrValuePatterns: ["data-.*"] }],
      errors: [
        {
          messageId: "restricted",
          line: 1,
          column: 11,
          data: { attrValuePatterns: "data-x" },
        },
      ],
    },
    {
      code: '<img alt="foo" />',
      options: [
        {
          attrPatterns: ["alt"],
          attrValuePatterns: ["^foo$"],
          message: "no foo for alt",
        },
      ],
      errors: [{ message: "no foo for alt", line: 1, column: 11 }],
    },
  ],
});
