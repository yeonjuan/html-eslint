const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-restricted-attr-values");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-restricted-attr-values", rule, {
  valid: [
    {
      code: `<div> </div>`,
      options: [
        {
          attrPatterns: [".*"],
          attrValuePatterns: ["data-.*"],
        },
      ],
    },
    {
      code: `<div class="foo"> </div>`,
      options: [
        {
          attrPatterns: ["class"],
          attrValuePatterns: ["data-.*"],
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
          attrValuePatterns: ["data-.*"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            attrValuePatterns: "data-x",
          },
        },
      ],
    },
    {
      code: `<div foo=""> </div>`,
      options: [
        {
          attrPatterns: [".*"],
          attrValuePatterns: [""],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            attrValuePatterns: "",
          },
        },
      ],
    },
    {
      code: `<div class="foo"> </div> <a alt="foo"></a>`,
      options: [
        {
          attrPatterns: ["alt"],
          attrValuePatterns: ["foo"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            attrValuePatterns: "foo",
          },
        },
      ],
    },
    {
      code: `<div alt="foo"> </div> <custom-element class="foo"></custom-element>`,
      options: [
        {
          attrPatterns: ["alt", "class"],
          attrValuePatterns: ["^foo$"],
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
          attrValuePatterns: ["data.*"],
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

templateRuleTester.run("[template] no-restricted-attr-values", rule, {
  valid: [
    {
      code: `html\`<div> </div>\``,
      options: [
        {
          attrPatterns: [".*"],
          attrValuePatterns: ["data-.*"],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `html\`<div alt="foo"> </div> <custom-element class="foo"></custom-element>\``,
      options: [
        {
          attrPatterns: ["alt", "class"],
          attrValuePatterns: ["^foo$"],
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
  ],
});
