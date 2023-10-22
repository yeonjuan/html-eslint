const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-restricted-attrs");

const ruleTester = createRuleTester();

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
          data: {
            attr: "alt",
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
        },
        {
          message: "no alt in img and custom element",
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
        },
      ],
    },
  ],
});
