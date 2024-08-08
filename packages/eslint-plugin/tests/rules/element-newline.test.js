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
          messageId: "expectBefore",
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
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
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
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
        },
        {
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
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
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
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
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
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
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
        },
        {
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
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
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
        },
        {
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
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
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
        },
        {
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
        },
        {
          messageId: "expectAfter",
        },
        {
          messageId: "expectAfterOpen",
        },
        {
          messageId: "expectBeforeClose",
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
          messageId: "expectAfter",
        },
      ],
    },
  ],
});
