const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-img-alt");

const ruleTester = createRuleTester();

ruleTester.run("require-img-alt", rule, {
  valid: [
    {
      code: `
<img src="./image.png" alt="image description"/>
`,
      filename: "test.html",
    },
    {
      code: `
<html>
  <body>
    <img src="./image.png" alt="image description">
  </body>
</html>
`,
      filename: "test.html",
    },
  ],
  invalid: [
    {
      code: `
<img src="./image.png"/>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "missingAlt",
        }
      ]
    },
    {
      code: `
<html>
  <body>
    <img src="./image.png">
  </body>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "missingAlt",
          line: 4,
          column: 6,
          endColumn: 29,
          endLine: 4,
        }
      ]
    },
    {
      code: `
<html>
  <body>
    <img src="./image.png" alt="">
  </body>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "missingAlt",
          line: 4,
          column: 6,
          endColumn: 36,
          endLine: 4,
        }
      ]
    },
    {
      code: `
<html>
  <body>
     <div>
        <img src="./image.png" alt="">
     </div>
  </body>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "missingAlt",
        }
      ]
    },
  ],
});
