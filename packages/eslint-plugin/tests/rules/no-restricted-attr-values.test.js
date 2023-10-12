const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-restricted-attr-values");

const ruleTester = createRuleTester();

ruleTester.run("no-restricted-attr-values", rule, {
  valid: [
    {
      code: `<div> </div>`,
      options: [
        {
          attrPatterns: [".*"],
          attrValues: ["data-.*"],
        },
      ],
    },
    {
      code: `<div> </div>`,
      options: [
        {
          attrPatterns: ["class"],
          attrValues: ["data-.*"],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `<div foo="data-x"> </div>`,
      options: [
        {
          attrPatterns: [".*"],
          attrValues: ["data-.*"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            attrValues: "data-x",
          },
        },
      ],
    },
    {
      code: `<div class="foo"> </div> <a alt="foo"></a>`,
      options: [
        {
          attrPatterns: ["alt"],
          attrValues: ["foo"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            attrValues: "foo",
          },
        },
      ],
    },
    {
      code: `<div alt="foo"> </div> <custom-element class="foo"></custom-element>`,
      options: [
        {
          attrPatterns: ["alt", "class"],
          attrValues: ["^foo$"],
          message: "no foo for alt or class",
        },
      ],
      errors: [
        {
          message: "no foo for alt or class",
        },
        {
          message: "no foo for alt or class",
        },
      ],
    },
    // custom message
    {
      code: `<div foo="data-x"> </div>`,
      options: [
        {
          attrPatterns: [".*"],
          attrValues: ["data.*"],
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
///^a$/
