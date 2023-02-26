const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-attrs");

const ruleTester = createRuleTester();

ruleTester.run("require-attrs", rule, {
  valid: [
    {
      code: `<svg></svg>`,
    },
  ],
  invalid: [
    {
      code: `<svg></svg>`,
      options: [
        {
          tag: "svg",
          attrs: ["viewBox"],
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'viewBox' attributes for 'svg' tag",
        },
      ],
    },
    {
      code: `<img/>`,
      options: [
        {
          tag: "img",
          attrs: ["alt", "src"],
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'alt', 'src' attributes for 'img' tag",
        },
      ],
    },
  ],
});
