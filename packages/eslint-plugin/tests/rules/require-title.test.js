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
<title></title>
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
<title>
</title>
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
