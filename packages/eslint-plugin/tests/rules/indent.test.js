const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/indent");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

function wrongIndentErrors(length) {
  return Array.from({ length }, () => ({
    messageId: "wrongIndent",
  }));
}

function changeLineEndings(tests) {
  tests.valid.forEach((test) => {
    test.code = test.code.replace(/\n/g, "\r\n");
  });
  tests.invalid.forEach((test) => {
    test.code = test.code.replace(/\n/g, "\r\n");
    test.output = test.output.replace(/\n/g, "\r\n");
  });
  return tests;
}

function createTests() {
  return {
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
      {
        code: `<div class="foo">
</div>
`,
      },
      {
        code: `<div class="foo"
    id="bar">
</div>
`,
      },
      // https://github.com/yeonjuan/html-eslint/issues/102
      {
        code: `
<table>
    <ng-container>
        <th>world</th>
        <td>hello</td>
    </ng-container>
</table>`,
      },
      // script & style
      {
        code: `
<script
>
</script>`,
      },
      {
        code: `
<script
    defer
    src="source.js">
</script>`,
      },
      {
        code: `
<html>
    <head>
        <script
            defer
            src="source.js">
        </script>
    </head>
</html>
`,
      },
      {
        code: `
<html>
    <head>
        <script>
    console.log('aa');
        </script>
    </head>
</html>
`,
      },
      {
        code: `
<style
>
</style>`,
      },
      {
        code: `
<style
    defer
    src="source.js">
</style>`,
      },
      {
        code: `
<html>
    <head>
        <style
        >
        </style>
    </head>
</html>
`,
      },
      {
        code: `
<html>
    <head>
        <style>
.foo { }
        </style>
    </head>
</html>
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
      {
        code: `<div class="foo"
id="bar"
 style="style"
>
</div>
`,
        output: `<div class="foo"
    id="bar"
    style="style"
>
</div>
`,
        errors: wrongIndentErrors(2),
      },
      {
        code: `<div class="foo"
id="bar"
 style="style">
</div>
`,
        output: `<div class="foo"
    id="bar"
    style="style">
</div>
`,
        errors: wrongIndentErrors(2),
      },
      {
        code: `<div class="foo"
id="bar"
 style="style"></div>
`,
        output: `<div class="foo"
    id="bar"
    style="style"></div>
`,
        errors: wrongIndentErrors(2),
      },
      {
        code: `
<div><div>
  </div>
</div>`,
        output: `
<div><div>
    </div>
</div>`,
        errors: wrongIndentErrors(1),
      },
      {
        code: `<div><a>
  </a>
</div>`,
        output: `<div><a>
    </a>
</div>`,
        errors: wrongIndentErrors(1),
      },
      // https://github.com/yeonjuan/html-eslint/issues/93
      {
        code: `
<div><a>
  </a>
</div>`,
        output: `
<div><a>
    </a>
</div>`,
        errors: wrongIndentErrors(1),
      },
      {
        code: `
<div><a>
  </a></div>`,
        output: `
<div><a>
    </a></div>`,
        errors: wrongIndentErrors(1),
      },
      {
        code: `
<div>
<a>
</a></div>`,
        output: `
<div>
    <a>
    </a></div>`,
        errors: wrongIndentErrors(2),
      },
      {
        code: `<div>
    <div>
  inner div </div>
</div>`,
        output: `<div>
    <div>
        inner div </div>
</div>`,
        errors: wrongIndentErrors(1),
      },
      // https://github.com/yeonjuan/html-eslint/issues/102
      {
        code: `
<table>
<ng-container>
        <th>world</th>
        <td>hello</td>
    </ng-container>
</table>`,
        output: `
<table>
    <ng-container>
        <th>world</th>
        <td>hello</td>
    </ng-container>
</table>`,
        errors: wrongIndentErrors(1),
      },
      {
        code: `
<script
  defer
    src="source.js">
</script>`,
        errors: wrongIndentErrors(1),
        output: `
<script
    defer
    src="source.js">
</script>`,
      },
      {
        code: `
<style
  >
    .foo {}
</style>`,
        errors: wrongIndentErrors(1),
        output: `
<style
>
    .foo {}
</style>`,
      },
    ],
  };
}

ruleTester.run("indent LF", rule, createTests());

ruleTester.run("indent CRLF", rule, changeLineEndings(createTests()));

templateRuleTester.run("[template] indent", rule, {
  valid: [
    {
      code: `html\`
<div>
    <div></div>
</div>
      \``,
    },
    // Ignore indentation in template expressions
    {
      code: `html\`
<div>
    \${items.map((item) => {
return "<div></div>"
})}
</div>
      \``,
    },
    {
      code: `html\`
<!-- \${\`
foo
   bar
      baz
\`}
-->
      \``,
    },
  ],
  invalid: [
    {
      code: `html\`
<div
id="\${bar}">
</div>
      \``,
      output: `html\`
<div
    id="\${bar}">
</div>
      \``,
      errors: wrongIndentErrors(1),
    },
  ],
});
