const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-img-alt");

const ruleTester = createRuleTester();

ruleTester.run("require-img-alt", rule, {
  valid: [
    {
      code: `
<img src="./image.png" alt="image description"/>
`,
    },
    {
      code: `
<html>
  <body>
    <img src="./image.png" alt="image description">
  </body>
</html>
`,
    },
    {
      code: `
<html>
  <body>
    <img src="./image.png" alt="">
  </body>
</html>
`,
    },
  ],
  invalid: [
    {
      code: `
<img src="./image.png"/>
`,

      errors: [
        {
          messageId: "missingAlt",
        },
      ],
    },
    {
      code: `
<html>
  <body>
    <img src="./image.png">
  </body>
</html>
`,

      errors: [
        {
          messageId: "missingAlt",
          line: 4,
          column: 6,
          endColumn: 29,
          endLine: 4,
        },
      ],
    },
  ],
});
