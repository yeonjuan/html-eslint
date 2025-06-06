const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-img-alt");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("require-img-alt", rule, {
  valid: [
    {
      code: `
<img src="./image.png" alt="image description"/>
`,
    },
    {
      code: `
<img src="./image.png" alt=""/>
`,
    },
    {
      code: `
<img src="./image.png" [alt]="image description"/>
`,
      options: [{ substitute: ["[alt]"] }],
    },
    {
      code: `
<img src="./image.png" [attr.alt]="image description"/>
`,
      options: [{ substitute: ["[alt]", "[attr.alt]"] }],
    },
    {
      code: `
<html>
  <body>
    <img src="./image.png" alt="image description">
  </body>
</html>
`,
    },
    {
      code: `
<html>
  <body>
    <img src="./image.png" alt="">
  </body>
</html>
`,
    },
  ],
  invalid: [
    {
      code: `
<img src="./image.png"/>
`,
      errors: [
        {
          messageId: "missingAlt",
          suggestions: [
            {
              messageId: "insertAlt",
              output: `
<img src="./image.png" alt=""/>
`,
            },
          ],
        },
      ],
    },
    {
      code: `
<html>
  <body>
    <img src="./image.png">
  </body>
</html>
`,
      errors: [
        {
          messageId: "missingAlt",
          line: 4,
          column: 5,
          endLine: 4,
          endColumn: 28,
          suggestions: [
            {
              messageId: "insertAlt",
              output: `
<html>
  <body>
    <img src="./image.png" alt="">
  </body>
</html>
`,
            },
          ],
        },
      ],
    },
    {
      code: `
<html>
  <body>
    <img src="./image.png">
  </body>
</html>
`,
      options: [{ substitute: ["[alt]"] }],
      errors: [
        {
          messageId: "missingAlt",
          line: 4,
          column: 5,
          endLine: 4,
          endColumn: 28,
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] require-img-alt", rule, {
  valid: [
    {
      code: `html\`<img src="./image.png" alt="image description"/>\``,
    },
    {
      code: `html\`<img src="./image.png" alt="\${alt}"/>\``,
    },
    {
      code: `html\`<img src="./image.png" alt=""/>\``,
    },
  ],
  invalid: [
    {
      code: `html\`<img src="./image.png"/>\``,
      errors: [
        {
          messageId: "missingAlt",
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 30,
          suggestions: [
            {
              messageId: "insertAlt",
              output: `html\`<img src="./image.png" alt=""/>\``,
            },
          ],
        },
      ],
    },
  ],
});
