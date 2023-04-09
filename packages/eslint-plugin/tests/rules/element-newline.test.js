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
                  <li>Item Here
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
          skipTags: ["pre", "code"],
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
          skipTags: ["div"],
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
          skipTags: ["div"],
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
      code: `<pre><div></div></pre><code><div></div></code>`,
      output: `<pre><div></div></pre>
<code><div></div></code>`,
      options: [
        {
          skipTags: ["pre", "code"],
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
          skipTags: ["div"],
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
          skipTags: ["div"],
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
