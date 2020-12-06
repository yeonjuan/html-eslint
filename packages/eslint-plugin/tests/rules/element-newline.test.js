const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/element-newline");

const ruleTester = createRuleTester();

ruleTester.run("element-newline", rule, {
  valid: [
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
      <!DOCTYPE html>
      <html lang="en">
          <body>
              <ul>
                  <li>Item Here
                  <li>Second Item Here</li>
              </ul>
          </body>
      </html>`,
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
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectBefore",
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
          messageId: "expectBefore",
        },
        {
          messageId: "expectBefore",
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
          messageId: "expectBefore",
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
          messageId: "expectAfter",
        },
        {
          messageId: "expectBefore",
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
          messageId: "expectBefore",
        },
        {
          messageId: "expectBefore",
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
          messageId: "expectBefore",
        },
        {
          messageId: "expectBefore",
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
          messageId: "expectBefore",
        },
        {
          messageId: "expectBefore",
        },
        {
          messageId: "expectBefore",
        },
      ],
    },
    {
      code: `
<!DOCTYPE html>
<html lang="en">
    <body>
        <ul>
            <li>Item Here <li>Second Item Here</li>
        </ul>
    </body>
</html>`,
      output: `
<!DOCTYPE html>
<html lang="en">
    <body>
        <ul>
            <li>Item Here 
<li>Second Item Here</li>
        </ul>
    </body>
</html>`,
      errors: [
        {
          messageId: "expectAfter",
        },
      ],
    },
  ],
});
