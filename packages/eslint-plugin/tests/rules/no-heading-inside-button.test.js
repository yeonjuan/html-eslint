const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-heading-inside-button");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-heading-inside-button", rule, {
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
  ],
});

templateRuleTester.run("[template] no-heading-inside-button", rule, {
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
  ],
});
