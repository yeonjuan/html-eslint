const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-title");

const ruleTester = createRuleTester();

ruleTester.run("require-title", rule, {
  valid: [
    {
      code: `
<html>
<head>
<title> title </title>
</head>
</html>
`,
      filename: "test.html",
    },
  ],
  invalid: [
    {
      code: `
<html>
<head>
</head>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "missingTitle",
        },
      ],
    },
    {
      code: `
<html>
<head>
<title></title>
</head>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "emptyTitle",
        },
      ],
    },
    {
      code: `
<html>
<head>
<title>
</title>
</head>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "emptyTitle",
        },
      ],
    },
  ],
});
