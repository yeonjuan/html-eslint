const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/indent");

const ruleTester = createRuleTester();

ruleTester.run("indent", rule, {
  valid: [
    {
      code: `
<html>
    <body>
        <div id = "foo"></div>
        <div id = "bar"></div>
    </body>
</html>
`,
      filename: "test.html",
    },
    {
      code: `
<html>
\t<body>
\t\t<div id = "foo"></div>
\t\t<div id = "bar"></div>
\t</body>
</html>
`,
      filename: "test.html",
      options: ["tab"],
    },
  ],
  invalid: [
    {
      code: `
<html>
<body>
</body>
</html>
`,
      output: `
<html>
    <body>
    </body>
</html>
`,
      filename: "test.html",
      errors: [
        {
          message: "Expected indentation of 4 space but found no indent.",
        },
        {
          message: "Expected indentation of 4 space but found no indent.",
        },
      ],
    },
    {
      code: `
<html>
<body>
</body>
</html>
`,
      output: `
<html>
\t<body>
\t</body>
</html>
`,
      filename: "test.html",
      options: ["tab"],
      errors: [
        {
          message: "Expected indentation of 1 tab but found no indent.",
        },
        {
          message: "Expected indentation of 1 tab but found no indent.",
        },
      ],
    },
    {
      code: `
<html>
<body>
<div> </div>
<div> </div>
</body>
</html>
`,
      output: `
<html>
    <body>
        <div> </div>
        <div> </div>
    </body>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "wrongIndent",
        },
        {
          messageId: "wrongIndent",
        },
        {
          messageId: "wrongIndent",
        },
        {
          messageId: "wrongIndent",
        },
      ],
    },
    {
      code: `
<html>
<body>
<div>
    </div>
<div> </div>
</body>
</html>
`,
      output: `
<html>
    <body>
        <div>
        </div>
        <div> </div>
    </body>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "wrongIndent",
        },
        {
          messageId: "wrongIndent",
        },
        {
          messageId: "wrongIndent",
        },
        {
          messageId: "wrongIndent",
        },
        {
          messageId: "wrongIndent",
        },
      ],
    },
    {
      code: `
<html>
<body>
\t <div> </div>
<div> </div>
</body>
</html>
`,
      output: `
<html>
    <body>
        <div> </div>
        <div> </div>
    </body>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "wrongIndent",
        },
        {
          messageId: "wrongIndent",
        },
        {
          messageId: "wrongIndent",
        },
        {
          messageId: "wrongIndent",
        },
      ],
    },
  ],
});
