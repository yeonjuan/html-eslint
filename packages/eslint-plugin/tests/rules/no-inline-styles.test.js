const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-inline-styles");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

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
    },
    {
      code: `<div style="{{ styles }}"></div>`,
      options: [{ allowExpressions: true }],
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
    },
    {
      code: `<div style="color: red; {{ moreStyles }}"></div>`,
      options: [{ allowExpressions: true }],
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
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

      errors: [
        {
          messageId: "unexpectedInlineStyle",
        },
      ],
    },
    {
      code: `<div style="{{ styles }}"></div>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
      errors: [
        {
          messageId: "unexpectedInlineStyle",
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 26,
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-inline-styles", rule, {
  valid: [
    {
      code: `
html\`<div></div>\`
      `,
    },
    {
      code: `
nohtml\`<div style="color:#fff"></div>\`
      `,
    },
    {
      code: `
const html = \`<div style="color:#fff"></div>\`
      `,
    },
    {
      code: `
let height = 150;
html\`<div style="height: \${height}px"></div>\`
      `,
      options: [{ allowExpressions: true }],
    },
    {
      code: `
html\`<div style="\${styles}"></div>\`
      `,
      options: [{ allowExpressions: true }],
    },
  ],
  invalid: [
    {
      code: `
html\`<div style="color:#fff"></div>\`
      `,
      errors: [
        {
          messageId: "unexpectedInlineStyle",
          line: 2,
          column: 11,
          endLine: 2,
          endColumn: 29,
        },
      ],
    },
    {
      code: `
const style = "color:#fff";
html\`<div style="\${style}"></div>\`;
      `,
      errors: [
        {
          messageId: "unexpectedInlineStyle",
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 27,
        },
      ],
    },
    {
      code: `
const html = /* html */\`<div style="color:#fff"></div>\`
      `,
      errors: [
        {
          messageId: "unexpectedInlineStyle",
          line: 2,
          column: 30,
          endLine: 2,
          endColumn: 48,
        },
      ],
    },
    {
      code: `
html\`<div style="color:#fff"></div>\`
      `,
      options: [{ allowExpressions: true }],
      errors: [
        {
          messageId: "unexpectedInlineStyle",
          line: 2,
          column: 11,
          endLine: 2,
          endColumn: 29,
        },
      ],
    },
  ],
});
