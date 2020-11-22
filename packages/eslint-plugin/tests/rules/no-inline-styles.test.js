const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-inline-styles");

const ruleTester = createRuleTester();

ruleTester.run("no-inline-styles", rule, {
  valid: [
    {
      code: `
<html>
<body>
<div> </div>
</body>
</html>
`,
      filename: "test.html",
    },
  ],
  invalid: [
    {
      code: `
<html>
<body>
<div style="color:#ff0a00"> </div>
</body>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "unexpectedInlineStyle",
        },
      ],
    },
  ],
});
