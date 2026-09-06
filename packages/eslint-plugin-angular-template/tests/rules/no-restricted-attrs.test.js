const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-restricted-attrs");

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
    // Custom elements with dashes should be ignored
    {
      code: '<custom-el data-x="1"></custom-el>',
      options: [{ tagPatterns: ["custom-el"], attrPatterns: ["data-.*"] }],
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
