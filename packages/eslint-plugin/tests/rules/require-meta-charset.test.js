const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-meta-charset");

const ruleTester = createRuleTester();

ruleTester.run("require-meta-charset", rule, {
  valid: [
    {
      code: `
<html>
      <head>
          <meta charset="UTF-8">
      </head>
</html>
`,
    },
    {
      code: `
<html>
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
          <meta name="description">
      </head>
</html>
`,

      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: `
<html>
      <head>
      </head>
</html>
`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: `
<html>
      <head>
          <meta charset="">
      </head>
</html>
`,
      errors: [
        {
          messageId: "empty",
        },
      ],
    },
    {
      code: `
<html>
      <head>
        <title> title </title>
        <meta foo="charset">
      </head>
</html>
`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
  ],
});
