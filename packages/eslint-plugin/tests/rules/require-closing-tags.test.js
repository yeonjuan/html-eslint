const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-closing-tags");

const ruleTester = createRuleTester();

ruleTester.run("require-closing-tags", rule, {
  valid: [
    {
      code: `<div></div>`,
    },
    {
      code: `<img>`,
    },
    {
      code: `<img/>`,
      options: [
        {
          selfClosing: "always",
        },
      ],
    },
    {
      code: `
    <body>
      <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
		  <circle> </circle>
</svg>
    </body>
`,
    },
    {
      code: `
    <body>
      <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
		  <circle />
</svg>
    </body>
`,
      options: [
        {
          selfClosing: "always",
        },
      ],
    },
    // https://github.com/yeonjuan/html-eslint/issues/73
    {
      code: `
<!DOCTYPE html>
<html>
<head>
</head>
<body>
<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="myGradient" gradientTransform="rotate(90)">
</linearGradient>
</defs>
</svg>
</body>
</html>
`,
    },
  ],
  invalid: [
    {
      code: `<div>`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: `<img>`,
      output: `<img />`,
      options: [
        {
          selfClosing: "always",
        },
      ],
      errors: [
        {
          messageId: "missingSelf",
        },
      ],
    },
    {
      code: `<img />`,
      output: `<img >`,
      options: [
        {
          selfClosing: "never",
        },
      ],
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
