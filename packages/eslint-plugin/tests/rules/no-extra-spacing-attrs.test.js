const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-extra-spacing-attrs");

const ruleTester = createRuleTester();

ruleTester.run("no-extra-spacing-attrs", rule, {
  valid: [
    {
      code: `
    <html>
    <body>
    <div foo="foo" bar="bar"></div>
    </body>
    </html>
    `,
    },
    {
      code: `
    <html>
    <body>
    <div foo="foo" bar="bar"></div>
    </body>
    </html>
    `,
    },
    {
      code: '<div foo="foo"\r\nbar="bar"></div>',
    },
    {
      code: `
  <html>
<head>
</head>
<body>
  <img src=""/>
</body>
</html>`,
    },
    {
      code: `
  <html>
<head>
</head>
<body>
  <svg>
      <circle cx="1"/>
  </svg>
</body>
</html>`,
    },
    {
      code: `
    <html>
    <body>
    <div foo="foo"
         bar="bar"></div>
    </body>
    </html>
    `,
    },
    {
      code: `
    <html>
    <body>
    <div
        foo="foo"
         bar="bar"
         ></div>
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
    <div foo="foo"  bar="bar"></div>
    </body>
    </html>
    `,
      output: `
    <html>
    <body>
    <div foo="foo" bar="bar"></div>
    </body>
    </html>
    `,
      errors: [
        {
          messageId: "unexpectedBetween",
        },
      ],
    },
    {
      code: `
    <html>
    <body>
    <div foo="foo"  bar="bar"  baz="baz"></div>
    </body>
    </html>
    `,
      output: `
    <html>
    <body>
    <div foo="foo" bar="bar" baz="baz"></div>
    </body>
    </html>
    `,
      errors: [
        {
          messageId: "unexpectedBetween",
        },
        {
          messageId: "unexpectedBetween",
        },
      ],
    },
    {
      code: `
    <html>
    <body>
    <div foo="foo"  bar="bar" baz="baz"  ></div>
    </body>
    </html>
        `,
      output: `
    <html>
    <body>
    <div foo="foo" bar="bar" baz="baz"></div>
    </body>
    </html>
        `,
      errors: [
        {
          messageId: "unexpectedBetween",
        },
        {
          messageId: "unexpectedAfter",
        },
      ],
    },
    {
      code: `
    <html>
    <body>
    <div       foo="foo"  bar="bar" baz="baz"  ></div>
    </body>
    </html>
            `,
      output: `
    <html>
    <body>
    <div foo="foo" bar="bar" baz="baz"></div>
    </body>
    </html>
            `,
      errors: [
        {
          messageId: "unexpectedBefore",
        },
        {
          messageId: "unexpectedBetween",
        },
        {
          messageId: "unexpectedAfter",
        },
      ],
    },
    {
      code: `
<html>
<head>
</head>
<body>
<img src="" />
</body>
</html>`,
      output: `
<html>
<head>
</head>
<body>
<img src=""/>
</body>
</html>`,
      errors: [
        {
          messageId: "unexpectedAfter",
        },
      ],
    },
    {
      code: `
<html>
<head>
</head>
<body>
<svg>
<circle cx="1" />
</svg>
</body>
</html>`,
      output: `
<html>
<head>
</head>
<body>
<svg>
<circle cx="1"/>
</svg>
</body>
</html>`,
      errors: [
        {
          messageId: "unexpectedAfter",
        },
      ],
    },
  ],
});
