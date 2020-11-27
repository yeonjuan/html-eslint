const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-multiple-h1");

const ruleTester = createRuleTester();

ruleTester.run("no-multiple-h1", rule, {
  valid: [
    {
      code: `
<html>
<body>
<h1>one heading</h1>
</body>
</html>
`,
    },
  ],
  invalid: [
    {
      code: `
<html>
<body>
<h1>one heading</h1>
<h1>two heading</h1>
</body>
</html>
`,

      errors: [
        {
          messageId: "unexpectedMultiH1",
        },
        {
          messageId: "unexpectedMultiH1",
        },
      ],
    },
  ],
});
