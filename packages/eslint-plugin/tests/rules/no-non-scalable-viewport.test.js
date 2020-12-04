const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-non-scalable-viewport");

const ruleTester = createRuleTester();

ruleTester.run("no-non-scalable-viewport", rule, {
  valid: [
    {
      code: `
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
</body>
</html>
`,
    },
  ],
  invalid: [
    {
      code: `
  <html>
  <head>
  <meta name="viewport" content="width=device-width, user-scalable=no">
  </head>
  <body>
  </body>
  </html>
`,

      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `
  <html>
  <head>
  <meta name="viewport" content="user-scalable=no, width=device-width">
  </head>
  <body>
  </body>
  </html>
`,

      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
