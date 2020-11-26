const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/indent");

const ruleTester = createRuleTester();

function wrongIndentErrors(length) {
  return Array.from({ length }, () => ({
    messageId: "wrongIndent",
  }));
}

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
      errors: wrongIndentErrors(4),
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
      errors: wrongIndentErrors(5),
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
      errors: wrongIndentErrors(4),
    },
    {
      code: `
<html>
<body>
<!-- comment -->
<div> </div>
<div> </div>
</body>
</html>
`,
      output: `
<html>
    <body>
        <!-- comment -->
        <div> </div>
        <div> </div>
    </body>
</html>
`,
      filename: "test.html",
      errors: wrongIndentErrors(5),
    },
    {
      code: `
<html>
<body>
<!-- comment
-->
<div> </div>
<div> </div>
</body>
</html>
`,
      output: `
<html>
    <body>
        <!-- comment
        -->
        <div> </div>
        <div> </div>
    </body>
</html>
`,
      filename: "test.html",
      errors: wrongIndentErrors(6),
    },
    {
      code: `
<html>
<body>
<!--
comment
-->
<div> </div>
<div> </div>
</body>
</html>
`,
      output: `
<html>
    <body>
        <!--
            comment
        -->
        <div> </div>
        <div> </div>
    </body>
</html>
`,
      filename: "test.html",
      errors: wrongIndentErrors(7),
    },
    {
      code: `
<div>
<!--
comment
-->
</div>
`,
      output: `
<div>
    <!--
        comment
    -->
</div>
`,
      filename: "test.html",
      errors: wrongIndentErrors(3),
    },
    {
      code: `
<div>
    <p>
indent
indent
indent
    </p>
</div>
`,
      output: `
<div>
    <p>
        indent
        indent
        indent
    </p>
</div>
`,
      filename: "test.html",
      errors: wrongIndentErrors(3),
    },
    {
      code: `
<div>
<p>
indent
indent
indent
</p>
<a>
indent
</a>
<div>
<div>
test
</div>
</div>
</div>
`,
      output: `
<div>
    <p>
        indent
        indent
        indent
    </p>
    <a>
        indent
    </a>
    <div>
        <div>
            test
        </div>
    </div>
</div>
`,
      filename: "test.html",
      errors: wrongIndentErrors(13),
    },
  ],
});
