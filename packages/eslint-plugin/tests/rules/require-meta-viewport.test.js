const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-meta-viewport");

const ruleTester = createRuleTester();

ruleTester.run("require-meta-viewport", rule, {
  valid: [
    {
      code: `
<html>
      <head>
          <meta name="viewport" content="foo">
      </head>
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
          <meta name="viewport" content="">
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
        <meta foo="description">
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
