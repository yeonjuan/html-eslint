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
    <body>
        <div>
            <div> foo </div>
            bar
        </div>
        <div>
            baz
            qux
        </div>
    </body>
</html>
`,
      filename: "test.html",
    },
    {
      code: `
<html>
    <head>
        <meta>
        <!-- foo -->
    </head>
</html>
`,
      filename: "test.html",
    },
    {
      code: `

<div>
    <div> foo </div>
    bar
</div>
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
    {
      code: `
<html>
    <body>
        <div>
            should not fixed
        </div>
    </body>
</html>
`,
      filename: "test.html",
    },
    {
      code: `
<html>
    <body>
        <pre>
 should not fixed
        </pre>
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
          message: "Expected indentation of 4 space but found 2 space.",
        },
        {
          message: "Expected indentation of 4 space but found 1 space.",
        },
      ],
    },
    {
      code: `
<html>
    <body>
       <div>
      </div>
    </body>
</html>
`,
      output: `
<html>
    <body>
        <div>
        </div>
    </body>
</html>
`,
      filename: "test.html",
      errors: [
        {
          message: "Expected indentation of 8 space but found 7 space.",
        },
        {
          message: "Expected indentation of 8 space but found 6 space.",
        },
      ],
    },
    {
      code: `
<html>
\t<body>
\t\t <div>
\t\t  </div>
\t</body>
</html>
`,
      output: `
<html>
\t<body>
\t\t<div>
\t\t</div>
\t</body>
</html>
`,
      filename: "test.html",
      options: ["tab"],
      errors: [
        {
          message: "Expected indentation of 2 tab but found 2 tab, 1 space.",
        },
        {
          message: "Expected indentation of 2 tab but found 2 tab, 2 space.",
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
indent indent
indent indent
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
        indent indent
        indent indent
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
