const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-restricted-attrs");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-restricted-attrs", rule, {
  valid: [
    {
      code: `<div> </div>`,
      options: [
        {
          tagPatterns: [".*"],
          attrPatterns: ["data-.*"],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `<div data-x="1"> </div>`,
      options: [
        {
          tagPatterns: [".*"],
          attrPatterns: ["data-.*"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          line: 1,
          column: 6,
          data: {
            attr: "data-x",
          },
        },
      ],
    },
    {
      code: `<div alt="foo"> </div> <a alt="foo"></a>`,
      options: [
        {
          tagPatterns: ["div"],
          attrPatterns: ["alt"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          line: 1,
          column: 6,
          data: {
            attr: "alt",
          },
        },
      ],
    },
    {
      code: `<script id="foo"> </script>`,
      options: [
        {
          tagPatterns: ["script"],
          attrPatterns: ["id"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          line: 1,
          column: 9,
          data: {
            attr: "id",
          },
        },
      ],
    },
    {
      code: `<style id="foo"> </style>`,
      options: [
        {
          tagPatterns: ["style"],
          attrPatterns: ["id"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          line: 1,
          column: 8,
          data: {
            attr: "id",
          },
        },
      ],
    },
    {
      code: `<div alt="foo"> </div> <img alt="a"/> <custom-element alt="foo"></custom-element>`,
      options: [
        {
          tagPatterns: ["img", ".*-.*"],
          attrPatterns: ["^alt$"],
          message: "no alt in img and custom element",
        },
      ],
      errors: [
        {
          message: "no alt in img and custom element",
          line: 1,
          column: 29,
        },
        {
          message: "no alt in img and custom element",
          line: 1,
          column: 55,
        },
      ],
    },
    // custom message
    {
      code: `<div data-x="1"> </div>`,
      options: [
        {
          tagPatterns: [".*"],
          attrPatterns: ["data-.*"],
          message: "please do not use 'data-x'",
        },
      ],
      errors: [
        {
          message: "please do not use 'data-x'",
          line: 1,
          column: 6,
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-restricted-attrs", rule, {
  valid: [
    {
      code: `html\`<div> </div>\``,
      options: [
        {
          tagPatterns: [".*"],
          attrPatterns: ["data-.*"],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `html\`<div data-x="1"> </div>\``,
      options: [
        {
          tagPatterns: [".*"],
          attrPatterns: ["data-.*"],
          message: "please do not use 'data-x'",
        },
      ],
      errors: [
        {
          message: "please do not use 'data-x'",
          line: 1,
          column: 11,
        },
      ],
    },
  ],
});
