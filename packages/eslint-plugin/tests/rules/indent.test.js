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
    },
    {
      code: `
<html>
  <body>
    <div id = "foo"></div>
    <div id = "bar"></div>
  </body>
</html>
`,
      options: [2],
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
    },
    {
      code: `

<div>
    <div> foo </div>
    bar
</div>
`,
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
    },
    {
      code: `
<html>
    <body>
        <pre>
        <div>
        should not fixed
        </div>
 
        </pre>
    </body>
</html>
`,
    },
    {
      code: `
<html>
    <body>
        <xmp>
    <div>
    should not fixed
    </div>
 
        </xmp>
    </body>
</html>
`,
    },
    {
      code: `
<html>
    <head>
        <style>
        foo
        </style>
    </head>
    <body>
        <pre>
        <div>
      should not fixed
        </div>
    
        </pre>
    </body>
</html>
`,
    },
    {
      code: `
<html>
    <head>
        <style>
    foo
        </style>
    </head>
    <body>
        <pre>
        <div>
      should not fixed
        </div>
    
        </pre>
        <div>
            <pre>
        <div>
      should not fixed
        </div>
        
            </pre>
        </div>
    </body>
</html>
`,
    },
    {
      code: `
<html>
    <body>
        <script>
              var a = 1;
        </script>
    </body>
</html>
`,
    },
    {
      code: `
<html>
    <body>
        <div id = "foo"></div>
        <div id = "bar"></div>
    </body>
    <script>
    </script>
</html>
`,
    },
    {
      code: `
<div
    id="foo"
    style="bar">
</div>
`,
    },
    {
      code: `
<div>
    <pre>
    
  <div
      id="foo"
 style="bar">
 </div>
    </pre>
</div>
`,
    },
    {
      code: `
<div
    id="foo"
    style="bar"
>
</div>
`,
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
      errors: wrongIndentErrors(13),
    },
    {
      code: `<!DOCTYPE html>
<html lang="en">
</head>
<body>
<table>
<tr>
  <td>Table 1</td>
</tr>
</table>
<table>
<tr>
  <td>Table 2</td>
</tr>
</table>
</body>
</html>`,
      output: `<!DOCTYPE html>
<html lang="en">
</head>
    <body>
        <table>
            <tr>
                <td>Table 1</td>
            </tr>
        </table>
        <table>
            <tr>
                <td>Table 2</td>
            </tr>
        </table>
    </body>
</html>`,
      errors: wrongIndentErrors(12),
    },
    {
      code: `
<div
id="foo"
style="bar">
</div>
`,
      output: `
<div
    id="foo"
    style="bar">
</div>
`,
      errors: wrongIndentErrors(2),
    },
    {
      code: `
<div
id="foo"
style="bar" class="baz">
</div>
`,
      output: `
<div
    id="foo"
    style="bar" class="baz">
</div>
`,
      errors: wrongIndentErrors(2),
    },
    {
      code: `
<div id="foo"
  style="bar" class="baz">
</div>
`,
      output: `
<div id="foo"
    style="bar" class="baz">
</div>
`,
      errors: wrongIndentErrors(1),
    },
    {
      code: `
<div
  id="foo"
  style="bar"
   >
</div>
`,
      output: `
<div
    id="foo"
    style="bar"
>
</div>
`,
      errors: wrongIndentErrors(3),
    },
    {
      code: `
<div>
  <div
      id="foo"
class="bar"
        style="baz"
  >
    </div>
</div>
`,
      output: `
<div>
    <div
        id="foo"
        class="bar"
        style="baz"
    >
    </div>
</div>
`,
      errors: wrongIndentErrors(4),
    },
    {
      code: `
<html>
    <head>
        <script src='http://somescript.js'></script>
    </head>
    <body>
<div id='hello'>
</div>
    </body>
</html>
`,
      output: `
<html>
    <head>
        <script src='http://somescript.js'></script>
    </head>
    <body>
        <div id='hello'>
        </div>
    </body>
</html>
`,
      errors: wrongIndentErrors(2),
    },
    {
      code: `
<html>
    <body>
        <template>
        <details></details>
        </template>
    </body>
</html>
`,
      output: `
<html>
    <body>
        <template>
            <details></details>
        </template>
    </body>
</html>
`,
      errors: wrongIndentErrors(1),
    },
  ],
});
