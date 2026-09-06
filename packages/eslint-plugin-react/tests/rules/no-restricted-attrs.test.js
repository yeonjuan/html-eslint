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
    // Custom components (capitalized) should not be checked
    {
      code: '<MyComponent data-x="1" />',
      options: [{ tagPatterns: ["MyComponent"], attrPatterns: ["data-.*"] }],
    },
  ],
  invalid: [
    {
      code: '<div data-x="1"></div>',
      options: [{ tagPatterns: [".*"], attrPatterns: ["data-.*"] }],
      errors: [{ messageId: "restricted", data: { attr: "data-x" } }],
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
      errors: [{ message: "no alt in img" }],
    },
  ],
});
