const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/element-newline");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("element-newline", rule, {
  valid: [
    {
      code: "<title>title</title>",
    },
    {
      code: `
<html>
<body>
</body>
</html>
`,
    },
    {
      code: `
<div>
Foo
Bar
<div></div>
</div>
`,
    },
    {
      code: "<body>\r\n<div></div>\r\n test\r\n</body>",
    },
    {
      code: "<html>\r\n<body>\r\n</body>\r\n</html>",
    },
    {
      code: `
      <!DOCTYPE html>
      <html lang="en">
          <body>
              <ul>
                  <li>Item Here</li>
                  <li>Second Item Here</li>
              </ul>
          </body>
      </html>`,
    },
    {
      code: `
<html>
<body>
      <pre><div></div></pre>
      <code>
      <div></div></code>
</body>
</html>
`,
      options: [
        {
          skip: ["pre", "code"],
        },
      ],
    },
    {
      code: `
<div>
<span><a></a></span>
</div>
`,
      options: [
        {
          skip: ["div"],
        },
      ],
    },
    {
      code: "<div>\r\n<span><a></a></span>\r\n</div>",
      options: [
        {
          skip: ["div"],
        },
      ],
    },
    {
      code: `
<div>
<span><a></a></span>
</div>
<span></span>
<a></a>
`,
      options: [
        {
          skip: ["div"],
        },
      ],
    },
    {
      code: `
<div>
<div></div><span></span><a></a>
</div>
`,
      options: [
        {
          skip: ["div"],
        },
      ],
    },
    {
      code: `<pre><div></div><code><span></span></code><a></a></pre>`,
      options: [
        {
          skip: ["pre", "code"],
        },
      ],
    },
    {
      code: `
<a>
  <b>
    <c><d></d></c>
  </b>
</a>
`,
      options: [
        {
          inline: [`d`],
        },
      ],
    },
    {
      code: `
<a>
  <b>
    <c><d></d></c>
  </b>
</a>
`,
      options: [
        {
          skip: [`c`],
        },
      ],
    },
    {
      code: `
<a></a><abbr></abbr><b></b><bdi></bdi><bdo></bdo><br></br><cite></cite><code></code><data></data><dfn></dfn><em></em><i></i><kbd></kbd><mark></mark><q></q><rp></rp><rt></rt><ruby></ruby><s></s><samp></samp><small></small><span></span><strong></strong><sub></sub><sup></sup><time></time><u></u><var></var><wbr></wbr>
`,
      options: [
        {
          inline: [`$inline`],
        },
      ],
    },
    {
      code: `
<div>
    I <strong>like</strong> these <dfn>inline</dfn> tags.
    <p>It's <em>true</em>!</p>
</div>
`,
      options: [
        {
          inline: [`$inline`],
        },
      ],
    },
    {
      code: `
        <h1 class="display1 md:text-[60px] md:leading-[68px] md:font-bold">
            An <span class="text-accent">ESLint</span>
            <br class="md:hidden">
            plugin<br>
            to lint and fix <span class="text-accent">HTML code</span>.
        </h1>
`,
      options: [
        {
          inline: [`$inline`],
        },
      ],
    },
    {
      code: `
      <header>
        <img
            foo="bar"
        >
        html-eslint
      </header>
      `,
      options: [
        {
          inline: [`$inline`],
        },
      ],
    },
    {
      code: "<title>{{title}}</title>",
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
    },
    {
      code: "<title>{{main}}{{sub}}</title>",
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
    },
    {
      code: "<title>name:{{title}}</title>",
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
    },
    {
      code: `---
  tag: <div></div><div></div>
---
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
  ],
  invalid: [
    {
      code: `
<!DOCTYPE html><html></html>
`,
      output: `
<!DOCTYPE html>
<html></html>
`,

      errors: [
        {
          messageId: "expectAfter",
        },
      ],
    },
    {
      code: `<div><script></script></div>`,
      output: `<div>
<script></script>
</div>`,
      errors: [
        {
          message: "There should be a linebreak after <div>.",
        },
        {
          message: "There should be a linebreak after </script>.",
        },
      ],
    },
    {
      code: `<div><style></style></div>`,
      output: `<div>
<style></style>
</div>`,
      errors: [
        {
          message: "There should be a linebreak after <div>.",
        },
        {
          message: "There should be a linebreak after </style>.",
        },
      ],
    },
    {
      code: `
<!DOCTYPE html>foo<html></html>
`,
      output: `
<!DOCTYPE html>
foo
<html></html>
`,

      errors: [
        {
          messageId: "expectAfter",
        },
        {
          message: "There should be a linebreak after text.",
        },
      ],
    },
    {
      code: `<div>text {{text}} <a></a></div>`,
      output: `<div>
text {{text}} 
<a></a>
</div>`,
      errors: [
        {
          message: "There should be a linebreak after <div>.",
        },
        {
          message: "There should be a linebreak after text.",
        },
        {
          message: "There should be a linebreak after </a>.",
        },
      ],
    },
    {
      code: `<div><div>text {{text}} <a></a></div></div>`,
      output: `<div>
<div>text {{text}} <a></a></div>
</div>`,
      options: [
        {
          inline: ["$inline"],
        },
      ],
      errors: [
        {
          message: "There should be a linebreak after <div>.",
        },
        {
          message: "There should be a linebreak after </div>.",
        },
      ],
    },
    {
      code: `
<!DOCTYPE html><!-- comment --><html></html>
`,
      output: `
<!DOCTYPE html>
<!-- comment -->
<html></html>
`,

      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
    },
    {
      code: `
<html><!-- comment --><div></div></html>
`,
      output: `
<html>
<!-- comment -->
<div></div>
</html>
`,

      errors: [
        {
          line: 2,
          column: 6,
          message: "There should be a linebreak after <html>.",
        },
        {
          message: "There should be a linebreak after comment.",
        },
        {
          message: "There should be a linebreak after </div>.",
        },
      ],
    },
    {
      code: `
<html><head><title>test</title></head></html>
`,
      output: `
<html>
<head>
<title>test</title>
</head>
</html>
`,

      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
    },
    {
      code: `
<html><body>test</body></html>
`,
      output: `
<html>
<body>test</body>
</html>
`,

      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
    },
    {
      code: `
<html><body></body></html>
`,
      output: `
<html>
<body></body>
</html>
`,

      errors: [
        {
          message: "There should be a linebreak after <html>.",
        },
        {
          message: "There should be a linebreak after </body>.",
        },
      ],
    },
    {
      code: `
<html><body><div></div><div></div></body></html>
`,
      output: `
<html>
<body>
<div></div>
<div></div>
</body>
</html>
`,

      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
    },
    {
      code: `
<html><body><div></div><div></div><div></div></body></html>
`,
      output: `
<html>
<body>
<div></div>
<div></div>
<div></div>
</body>
</html>
`,

      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
    },
    {
      code: `
<html><body><div></div><div><a></a></div><div></div></body></html>
`,
      output: `
<html>
<body>
<div></div>
<div>
<a></a>
</div>
<div></div>
</body>
</html>
`,

      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
    },
    {
      code: `<pre><div></div></pre><code><div></div></code>`,
      output: `<pre><div></div></pre>
<code><div></div></code>`,
      options: [
        {
          skip: ["pre", "code"],
        },
      ],
      errors: [
        {
          messageId: "expectAfter",
        },
      ],
    },
    {
      code: `
<span></span><a></a>
<div>
<span><a></a></span>
</div>
<span></span><a></a>
`,
      output: `
<span></span>
<a></a>
<div>
<span><a></a></span>
</div>
<span></span>
<a></a>
`,
      options: [
        {
          skip: ["div"],
        },
      ],
      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
    },
    {
      code: `
<span></span><div>
<span><a></a></span>
</div>
`,
      output: `
<span></span>
<div>
<span><a></a></span>
</div>
`,
      options: [
        {
          skip: ["div"],
        },
      ],
      errors: [
        {
          line: 2,
          message: "There should be a linebreak after </span>.",
        },
      ],
    },
    {
      code: `
<a></a><abbr></abbr><b></b><bdi></bdi><bdo></bdo><br></br><cite></cite><code></code><div></div><data></data><dfn></dfn><em></em><i></i><kbd></kbd><mark></mark><q></q><rp></rp><rt></rt><ruby></ruby><s></s><samp></samp><small></small><span></span><strong></strong><sub></sub><sup></sup><time></time><u></u><var></var><wbr></wbr>
`,
      output: `
<a></a><abbr></abbr><b></b><bdi></bdi><bdo></bdo><br></br><cite></cite><code></code>
<div></div>
<data></data><dfn></dfn><em></em><i></i><kbd></kbd><mark></mark><q></q><rp></rp><rt></rt><ruby></ruby><s></s><samp></samp><small></small><span></span><strong></strong><sub></sub><sup></sup><time></time><u></u><var></var><wbr></wbr>
`,
      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
      options: [
        {
          inline: [`$inline`],
        },
      ],
    },
    {
      code: `
<div>aaa<strong>bbb</strong><a>ccc</a><p>ddd<i>eee</i></p></div>
`,
      output: `
<div>
aaa<strong>bbb</strong><a>ccc</a>
<p>ddd<i>eee</i></p>
</div>
`,
      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
      options: [
        {
          inline: [`$inline`],
        },
      ],
    },
    {
      code: "<title><a>{{main}}{{sub}}</a></title>",
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
      output: `<title>
<a>{{main}}{{sub}}</a>
</title>`,
      errors: [
        {
          message: "There should be a linebreak after <title>.",
        },
        {
          message: "There should be a linebreak after </a>.",
        },
      ],
    },
    {
      code: `---
  tag: <div></div><div></div>
---
<div></div><div></div>
      `,
      errors: [
        {
          message: "There should be a linebreak after </div>.",
          line: 4,
          column: 1,
        },
      ],
      output: `---
  tag: <div></div><div></div>
---
<div></div>
<div></div>
      `,
      languageOptions: {
        parserOptions: {
          frontmatter: true,
        },
      },
    },
  ],
});

templateRuleTester.run("[template] element-newline", rule, {
  valid: [
    {
      code: `
    const code = /* html */\`<html>
    <body>
    </body>
    </html>\`
    `,
    },
  ],
  invalid: [
    {
      code: `html\`<div>aaa<strong>bbb</strong><a>ccc</a><p>ddd<i>eee</i></p></div>\`;`,
      output: `html\`<div>
aaa<strong>bbb</strong><a>ccc</a>
<p>ddd<i>eee</i></p>
</div>\`;`,
      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
      options: [
        {
          inline: [`$inline`],
        },
      ],
    },
    {
      code: `const code = /* html */\`<div>aaa<strong>bbb</strong><a>ccc</a><p>ddd<i>eee</i></p></div>\`;`,
      output: `const code = /* html */\`<div>
aaa<strong>bbb</strong><a>ccc</a>
<p>ddd<i>eee</i></p>
</div>\`;`,
      errors: [
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
      ],
      options: [
        {
          inline: [`$inline`],
        },
      ],
    },
  ],
});
