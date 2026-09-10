const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-restricted-attr-values");

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
    // Custom elements with dashes should be ignored
    {
      code: '<custom-el foo="data-x"></custom-el>',
      options: [{ attrPatterns: [".*"], attrValuePatterns: ["data-.*"] }],
    },
    // Bound attributes (expressions) should be skipped (key.hasExpression() = true)
    {
      code: '<div [class]="expr"></div>',
      options: [{ attrPatterns: ["class"], attrValuePatterns: [".*"] }],
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
