const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-meta-description");

const ruleTester = createRuleTester();

ruleTester.run("require-meta-description", rule, {
  valid: [
    {
      code: `
<html>
      <head>
          <meta name="description" content="foo">
      </head>
</html>
`,
    },
    {
      code: `
<html>
      <head>
          <meta name="Description" content="foo">
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
          <meta name="author" content="Yeon JuAn">
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
          <meta name="description">
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
          <meta name="description" content="">
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
          <meta name="description" content="  ">
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
          <meta name="description" content>
      </head>
</html>
`,
      errors: [
        {
          messageId: "empty",
        },
      ],
    },
  ],
});
