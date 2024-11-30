const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-aria-hidden-body");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-aria-hidden-body", rule, {
  valid: [
    {
      code: `<div aria-hidden> </div>`,
    },
    {
      code: `<body aria-hidden="false"> </body>`,
    },
    {
      code: `<body> </body>`,
    },
  ],
  invalid: [
    {
      code: `<body aria-hidden> </body>`,
      errors: [
        {
          message: "Unexpected aria-hidden on body tag.",
        },
      ],
    },
    {
      code: `<body aria-hidden="true"> </body>`,
      errors: [
        {
          message: "Unexpected aria-hidden on body tag.",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-aria-hidden-body", rule, {
  valid: [
    {
      code: `html\`<div aria-hidden> </div>\``,
    },
    {
      code: `html\`<body aria-hidden=\${value}> </body>\``,
    },
  ],
  invalid: [
    {
      code: `html\`<body aria-hidden="true"> </body>\``,
      errors: [
        {
          message: "Unexpected aria-hidden on body tag.",
        },
      ],
    },
  ],
});
