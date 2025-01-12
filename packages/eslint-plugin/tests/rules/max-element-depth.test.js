const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/max-element-depth");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("max-element-depth", rule, {
  valid: [
    {
      code: `<div> </div>`,
    },
    {
      code: `<div><div></div></div>`,
    },
    {
      code: `<div><div></div></div>`,
      options: [
        {
          max: 2,
        },
      ],
    },
    {
      code: `
<div><div></div></div>
<div><div></div></div>
`,
      options: [
        {
          max: 2,
        },
      ],
    },
  ],
  invalid: [
    {
      code: `<div><div><div></div></div></div>`,
      options: [
        {
          max: 2,
        },
      ],
      errors: [
        {
          message:
            "Expected the depth of nested elements to be <= 2, but found 3",
        },
      ],
    },
    {
      code: `
<div><div></div></div>
<div><div><div></div></div></div>
<div><div></div></div>
`,
      options: [
        {
          max: 2,
        },
      ],
      errors: [
        {
          message:
            "Expected the depth of nested elements to be <= 2, but found 3",
        },
      ],
    },
    {
      code: `
<div><div></div></div>
<div><div><div><script></script></div></div></div>
<div><div><div><style></style></div></div></div>
<div><div></div></div>
  `,
      options: [
        {
          max: 3,
        },
      ],
      errors: [
        {
          message:
            "Expected the depth of nested elements to be <= 3, but found 4",
        },
        {
          message:
            "Expected the depth of nested elements to be <= 3, but found 4",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] max-element-depth", rule, {
  valid: [
    {
      code: `html\`<div> </div>\``,
    },
    {
      code: `html\`<div><div></div></div>\``,
    },
    {
      code: `html\`<div><div></div></div>\``,
      options: [
        {
          max: 2,
        },
      ],
    },
    {
      code: `html\`
    <div><div></div></div>
    <div><div></div></div>\`;
    `,
      options: [
        {
          max: 2,
        },
      ],
    },
    {
      code: `
  html\`
  <div>
      <div>
          \${html\`<div></div>\`}
      </div>
  </div>\`
          `,
      options: [
        {
          max: 2,
        },
      ],
    },
  ],
  invalid: [
    {
      code: `html\`<div><div><div></div></div></div>\``,
      options: [
        {
          max: 2,
        },
      ],
      errors: [
        {
          message:
            "Expected the depth of nested elements to be <= 2, but found 3",
        },
      ],
    },
    {
      code: `html\`
    <div><div></div></div>
    <div><div><div></div></div></div>
    <div><div></div></div>\`;
    `,
      options: [
        {
          max: 2,
        },
      ],
      errors: [
        {
          message:
            "Expected the depth of nested elements to be <= 2, but found 3",
        },
      ],
    },
    {
      code: `html\`
    <div><div></div></div>
    <div><div><div><script></script></div></div></div>
    <div><div><div><style></style></div></div></div>
    <div><div></div></div>\`
      `,
      options: [
        {
          max: 3,
        },
      ],
      errors: [
        {
          message:
            "Expected the depth of nested elements to be <= 3, but found 4",
        },
        {
          message:
            "Expected the depth of nested elements to be <= 3, but found 4",
        },
      ],
    },
  ],
});
