const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-attrs");

const ruleTester = createRuleTester();

ruleTester.run("require-attrs", rule, {
  valid: [
    {
      code: `<svg></svg>`,
    },
    {
      code: `<svg viewBox="0 0 100 100"></svg>`,
      options: [
        {
          tag: "svg",
          attrs: ["viewBox"],
        },
      ],
    },
    {
      code: `<img alt="image" src="/assets/image.png">`,
      options: [
        {
          tag: "img",
          attrs: ["alt", "src"],
        },
      ],
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
    {
      code: `<IMG id="1"/>`,
      options: [
        {
          tag: "img",
          attrs: ["alt"],
        },
        {
          tag: "img",
          attrs: ["src"],
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
