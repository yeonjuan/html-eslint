/**
 * @import {RuleTester} from "eslint";
 */

const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/indent");
const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

/**
 * @param {number} length
 * @returns
 */
function wrongIndentErrors(length) {
  return Array.from({ length }, () => ({
    messageId: "wrongIndent",
  }));
}

/**
 *
 * @param {{ valid: RuleTester.ValidTestCase[]; invalid: RuleTester.InvalidTestCase[];}} tests
 * @returns
 */
function changeLineEndings(tests) {
  tests.valid.forEach((test) => {
    test.code = test.code.replace(/\n/g, "\r\n");
  });
  tests.invalid.forEach((test) => {
    test.code = test.code.replace(/\n/g, "\r\n");
    if (test.output) {
      test.output = test.output.replace(/\n/g, "\r\n");
    }
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
      {
        code: `
<div
    id="1">
  <span></span>
</div>
        `,
        options: [
          2,
          {
            Attribute: 2,
          },
        ],
      },
      {
        code: `
<html lang="es">
<head>
</head>
<body>
</body>
</html>
        `,
        options: [
          2,
          {
            tagChildrenIndent: {
              html: 0,
            },
          },
        ],
      },
      {
        code: `
<html
  lang="es">
<body>
  <div></div>
  text
</body>
</html>
        `,
        options: [
          2,
          {
            tagChildrenIndent: {
              html: 0,
            },
          },
        ],
      },
      {
        code: `
<!DOCTYPE html>
<html>
<body>
</body>
<script src=""></script>
</html>
`,
        options: [
          2,
          {
            tagChildrenIndent: {
              html: 0,
              body: 0,
            },
          },
        ],
      },
      {
        code: `
<!DOCTYPE html>
<html>
<body>
</body>
<style></style>
</html>
`,
        options: [
          2,
          {
            tagChildrenIndent: {
              html: 0,
              body: 0,
            },
          },
        ],
      },
      {
        code: `
<style>
</style>
<script>
</script>
        `,
      },
      {
        code: `
<div>
<pre>
{{content}}
</pre>
</html>
        `,
      },
      {
        code: `
<div>
    {{content}} {{content2}}
</html>
        `,
      },
      {
        code: `---
  name: value
---
<div>
</div>
        `,
        languageOptions: {
          parserOptions: {
            frontmatter: true,
          },
        },
      },
      {
        code: `
<markdown>
# Hello, world!

\`\`\`cpp{4-6,9}
#include <iostream>

class Example {
    Example() {
        std::cout << "Hello, world!" << std::endl;
    }

    Example(std::string name) {
        std::cout << "Hello, " << name << std::endl;
    }
};
\`\`\`
</markdown>
      `,
        languageOptions: {
          parserOptions: {
            rawContentTags: ["markdown"],
          },
        },
      },
      {
        code: `
<div>
text
</div>
        `,
        options: [
          2,
          {
            tagChildrenIndent: {
              div: 0,
            },
          },
        ],
      },
      {
        code: `
<div>
        text
</div>
        `,
        options: [
          2,
          {
            tagChildrenIndent: {
              div: 4,
            },
          },
        ],
      },
      {
        code: `
<div>
  text
  <!--
comment
<div></div>
  -->
</div>
        `,
        options: [
          2,
          {
            ignoreCommentContent: true,
          },
        ],
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
      {
        code: `
<div
\t\t\t\tid="1">
\t<span></span>
</div>
        `,
        options: [
          "tab",
          {
            Attribute: 3,
          },
        ],
        errors: wrongIndentErrors(1),
        output: `
<div
\t\t\tid="1">
\t<span></span>
</div>
        `,
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
        errors: wrongIndentErrors(1),
        options: [
          2,
          {
            tagChildrenIndent: {
              html: 0,
            },
          },
        ],
      },
      {
        code: `
<div>
  text
</div>
        `,
        output: `
<div>
text
</div>
        `,
        errors: wrongIndentErrors(1),
        options: [
          2,
          {
            tagChildrenIndent: {
              div: 0,
            },
          },
        ],
      },
      {
        code: `
<style>
   </style>
<script>
  </script>
        `,
        output: `
<style>
</style>
<script>
</script>
        `,
        errors: wrongIndentErrors(2),
      },
      {
        code: `
<html>
{{content}}
</html>
        `,
        errors: wrongIndentErrors(1),
        output: `
<html>
    {{content}}
</html>
        `,
        languageOptions: {
          parserOptions: {
            templateEngineSyntax: {
              "{{": "}}",
            },
          },
        },
      },
      {
        code: `
<html>
{{
  content
}}
</html>
        `,
        errors: wrongIndentErrors(2),
        output: `
<html>
    {{
  content
    }}
</html>
        `,
        languageOptions: {
          parserOptions: {
            templateEngineSyntax: {
              "{{": "}}",
            },
          },
        },
      },
      {
        code: `
<!--
{{
  content
}}
-->
        `,
        errors: wrongIndentErrors(2),
        output: `
<!--
    {{
  content
    }}
-->
        `,
        languageOptions: {
          parserOptions: {
            templateEngineSyntax: {
              "{{": "}}",
            },
          },
        },
      },
      {
        code: `
<div
{{ content }}>
</div>
        `,
        errors: wrongIndentErrors(1),
        output: `
<div
    {{ content }}>
</div>
        `,
        languageOptions: {
          parserOptions: {
            templateEngineSyntax: {
              "{{": "}}",
            },
          },
        },
      },
      {
        code: `
<div>
{{ content }}
 <span></span>
 {{ content2 }}
</div>
        `,
        errors: wrongIndentErrors(3),
        output: `
<div>
    {{ content }}
    <span></span>
    {{ content2 }}
</div>
        `,
        languageOptions: {
          parserOptions: {
            templateEngineSyntax: {
              "{{": "}}",
            },
          },
        },
      },
      {
        code: `
<div>
{{ content }}
 <span></span>
 {{{ content2 }}}
</div>
        `,
        errors: wrongIndentErrors(3),
        output: `
<div>
    {{ content }}
    <span></span>
    {{{ content2 }}}
</div>
        `,
        languageOptions: {
          parserOptions: {
            templateEngineSyntax: {
              "{{": "}}",
              "{{{": "}}}",
            },
          },
        },
      },
      {
        code: `<div>
<div></div>
</div>
        `,
        languageOptions: {
          parserOptions: {
            frontmatter: true,
          },
        },
        errors: wrongIndentErrors(1),
        output: `<div>
    <div></div>
</div>
        `,
      },
      {
        code: `---
  name: value
---
<div>
<div></div>
</div>
        `,
        languageOptions: {
          parserOptions: {
            frontmatter: true,
          },
        },
        errors: wrongIndentErrors(1),
        output: `---
  name: value
---
<div>
    <div></div>
</div>
        `,
      },
      {
        code: `
<div>
  text
  <!--
comment
<div></div>
  -->
</div>
        `,
        output: `
<div>
  text
  <!--
    comment
    <div></div>
  -->
</div>
        `,
        options: [
          2,
          {
            ignoreCommentContent: false,
          },
        ],
        errors: wrongIndentErrors(2),
      },
    ],
  };
}

ruleTester.run("indent LF", rule, createTests());

ruleTester.run("indent CRLF", rule, changeLineEndings(createTests()));

templateRuleTester.run("[template] indent", rule, {
  valid: [
    {
      code: `/*html*/\`<div></div>\``,
    },
    {
      code: `html\`
    <div>
        <div></div>
    </div>
      \``,
    },
    {
      code: `html\`
    <div>
        \${
    content}
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
    {
      code: `
  class Component extends LitElement {
    render() {
      return html\`<p>content</p>
      \`;
    }
  }
        `,
    },
    {
      code: `
const code = html\`
  <!DOCTYPE html>
  <html lang="es">
  <head>
  </head>
  <body>
  </body>
  </html>
\`;
      `,
      options: [
        2,
        {
          tagChildrenIndent: {
            html: 0,
          },
        },
      ],
    },
    {
      code: `html\`
  <span>
    <div>
    text
    </div>
  </span>
      \``,
      options: [
        2,
        {
          tagChildrenIndent: {
            div: 0,
          },
        },
      ],
    },
  ],
  invalid: [
    {
      code: `html\`
    <div>
\${content}
    </div>
      \``,
      output: `html\`
    <div>
        \${content}
    </div>
      \``,
      errors: wrongIndentErrors(1),
    },
    {
      code: `html\`
    <div>
        \${content
}
    </div>
      \``,
      output: `html\`
    <div>
        \${content
        }
    </div>
      \``,
      errors: wrongIndentErrors(1),
    },
    {
      code: `html\`
    <div>
\${
        content}
    </div>
      \``,
      output: `html\`
    <div>
        \${
        content}
    </div>
      \``,
      errors: wrongIndentErrors(1),
    },
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
      errors: wrongIndentErrors(3),
    },
    {
      code: `html\`
<div
\${id}>
</div>
      \``,
      output: `html\`
    <div
        \${id}>
    </div>
      \``,
      errors: wrongIndentErrors(3),
    },
    {
      code: `
const obj = {
    html: html\`
<div>
            id="\${bar}">
        </div>\`
}
    `,
      output: `
const obj = {
    html: html\`
        <div>
            id="\${bar}">
        </div>\`
}
    `,
      errors: wrongIndentErrors(1),
    },
    {
      code: `
const obj = {
    html: /*html*/\`
<div>
            id="\${bar}">
        </div>\`
}
    `,
      output: `
const obj = {
    html: /*html*/\`
        <div>
            id="\${bar}">
        </div>\`
}
    `,
      errors: wrongIndentErrors(1),
    },
    {
      code: `
const obj = {
    one: {
        two: html\`
<div
            id="\${bar}">
        </div>\`,
    }
}
    `,
      output: `
const obj = {
    one: {
        two: html\`
            <div
                id="\${bar}">
            </div>\`,
    }
}
    `,
      errors: wrongIndentErrors(3),
    },
    {
      code: `
class Component extends LitElement {
  render() {
    return html\`
            <p>content</p>
    \`;
  }
}
      `,
      output: `
class Component extends LitElement {
  render() {
    return html\`
      <p>content</p>
    \`;
  }
}
      `,
      options: [2],
      errors: wrongIndentErrors(1),
    },
    {
      code: `
class Component extends LitElement {
  render() {
    return html\`
            <div>
            content
            <span></span>
            </div>
    \`;
  }
}
      `,
      output: `
class Component extends LitElement {
  render() {
    return html\`
      <div>
        content
        <span></span>
      </div>
    \`;
  }
}
      `,
      options: [2],
      errors: wrongIndentErrors(4),
    },
    {
      code: `
class Component extends LitElement {
  render() {
    return html\`
      <p>content</p>
      \${repeat([], item => html\`
<p>content</p>
      \`)}
      \${repeat(
          [],
          item => html\`
            <p>content</p>
          \`)}
      \${
        repeat(
            [],
            item => html\`
              <p>content</p>
            \`)
      }
    \`;
  }
}
      `,
      output: `
class Component extends LitElement {
  render() {
    return html\`
      <p>content</p>
      \${repeat([], item => html\`
        <p>content</p>
      \`)}
      \${repeat(
          [],
          item => html\`
            <p>content</p>
          \`)}
      \${
        repeat(
            [],
            item => html\`
              <p>content</p>
            \`)
      }
    \`;
  }
}
      `,
      options: [2],
      errors: wrongIndentErrors(1),
    },
    {
      code: `
class Component extends LitElement {
  render() {
    return html\`
      \${when(true, () => html\`
          <foo-bar
          id="1"
          ></foo-bar>
      \`)}
    \`;
  }
}
      `,
      output: `
class Component extends LitElement {
  render() {
    return html\`
      \${when(true, () => html\`
        <foo-bar
            id="1"
        ></foo-bar>
      \`)}
    \`;
  }
}
      `,
      options: [2, { Attribute: 2 }],
      errors: wrongIndentErrors(3),
    },
    {
      code: `
class Component extends LitElement {
  render() {
    return html\`
      \${when(true, () => html\`
        <foo-bar
            .baz="\${value => html\`
            <foo-baz
                 bar></foo-baz>
              \`}"></foo-bar>
      \`)}
    \`;
  }
}
      `,
      output: `
class Component extends LitElement {
  render() {
    return html\`
      \${when(true, () => html\`
        <foo-bar
            .baz="\${value => html\`
              <foo-baz
                  bar></foo-baz>
              \`}"></foo-bar>
      \`)}
    \`;
  }
}
      `,
      options: [2, { Attribute: 2 }],
      errors: wrongIndentErrors(2),
    },
    {
      code: `
class Component extends LitElement {
\trender() {
\t\treturn html\`
\t\t\t<div>
\t\t\t\t<span></span>
\t\t\t</div>
\t\t\t<span>
\t\t\t\t<div></div>
\t\t\t</span>
    \`;
  }
}
      `,
      output: `
class Component extends LitElement {
\trender() {
\t\treturn html\`
\t\t\t<div>
\t\t\t\t<span></span>
\t\t\t</div>
\t\t\t<span>
\t\t\t\t\t<div></div>
\t\t\t</span>
    \`;
  }
}
      `,
      options: ["tab", { Attribute: 2, tagChildrenIndent: { span: 2 } }],
      errors: wrongIndentErrors(1),
    },
  ],
});
