const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-meta-charset");

const ruleTester = createRuleTester();

ruleTester.run("require-meta-charset", rule, {
  valid: [
    {
      code: `
<html>
      <head>
          <meta charset="UTF-8">
      </head>
</html>
`,
    },
    {
      code: `
<html>
      <body>
      </body>
</html>
`,
    },
  ],
  invalid: [
    {
      code: `
<html>
      <head>
          <meta name="description">
      </head>
</html>
`,
      output: `
<html>
      <head>
          <meta charset="UTF-8">
          <meta name="description">
      </head>
</html>
`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: `
<html>
      <head>
      </head>
</html>
`,
      output: `
<html>
      <head>
      <meta charset="UTF-8">
      </head>
</html>
`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: `
<html>
      <head>
          <meta charset="">
      </head>
</html>
`,
      output: `
<html>
      <head>
          <meta charset="UTF-8">
      </head>
</html>
`,
      errors: [
        {
          messageId: "empty",
        },
      ],
    },
    {
      code: `
<html>
      <head>
        <title> title </title>
        <meta foo="charset">
      </head>
</html>
`,
      output: `
<html>
      <head>
        <meta charset="UTF-8">
        <title> title </title>
        <meta foo="charset">
      </head>
</html>
`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      // bare charset attribute with no value: <meta charset>
      code: `<html><head><meta charset></head></html>`,
      output: `<html><head><meta charset="UTF-8"></head></html>`,
      errors: [
        {
          messageId: "empty",
        },
      ],
    },
    {
      // head with no leading whitespace before first child
      code: `<html><head><title>t</title></head></html>`,
      output: `<html><head>\n            <meta charset="UTF-8"><title>t</title></head></html>`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      // completely empty head (zero children, no whitespace)
      code: `<html><head></head></html>`,
      output: `<html><head>\n        <meta charset="UTF-8"></head></html>`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
  ],
});
