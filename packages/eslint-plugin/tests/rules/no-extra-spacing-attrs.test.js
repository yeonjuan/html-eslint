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
    // https://github.com/yeonjuan/html-eslint/issues/137
    {
      code: "<a target=”_blank” a b c d e f></a>",
    },
    {
      code: "<img />",
      options: [
        {
          enforceBeforeSelfClose: true,
        },
      ],
    },
    {
      code: "<img\n/>",
      options: [
        {
          enforceBeforeSelfClose: true,
        },
      ],
    },
    {
      code: "<img src='foo.png' />",
      options: [
        {
          enforceBeforeSelfClose: true,
        },
      ],
    },
    {
      code: "<img src='foo.png'\n/>",
      options: [
        {
          enforceBeforeSelfClose: true,
        },
      ],
    },
    {
      code: "<img src='foo.png'/>",
      options: [
        {
          enforceBeforeSelfClose: false,
        },
      ],
    },
    {
      code: `<img src='foo.png'alt='foo'/>`,
    },
    {
      code: `<img src='foo.png'alt='foo'/>`,
      options: [
        {
          disallowMissing: false,
        },
      ],
    },
    {
      code: `<img src='foo.png' alt='foo'/>`,
      options: [
        {
          disallowMissing: true,
        },
      ],
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
    {
      code: "<img src='foo.png' />",
      output: "<img src='foo.png'/>",
      errors: [
        {
          messageId: "unexpectedAfter",
        },
      ],
    },
    {
      code: "<a target=”_blank”  a b c d e f></a>",
      output: "<a target=”_blank” a b c d e f></a>",
      errors: [
        {
          messageId: "unexpectedBetween",
        },
      ],
    },
    {
      code: "<img src='foo.png'  />",
      options: [
        {
          enforceBeforeSelfClose: true,
        },
      ],
      output: "<img src='foo.png' />",
      errors: [
        {
          messageId: "unexpectedBeforeSelfClose",
        },
      ],
    },
    {
      code: "<img src='foo.png'/>",
      options: [
        {
          enforceBeforeSelfClose: true,
        },
      ],
      output: "<img src='foo.png' />",
      errors: [
        {
          messageId: "missingBeforeSelfClose",
        },
      ],
    },
    {
      code: "<img/>",
      output: "<img />",
      options: [
        {
          enforceBeforeSelfClose: true,
        },
      ],
      errors: [
        {
          messageId: "missingBeforeSelfClose",
        },
      ],
    },
    {
      code: "<img  />",
      output: "<img />",
      options: [
        {
          enforceBeforeSelfClose: true,
        },
      ],
      errors: [
        {
          messageId: "unexpectedBeforeSelfClose",
        },
      ],
    },
    {
      code: "<img src='foo.png' />",
      output: "<img src='foo.png'/>",
      options: [
        {
          enforceBeforeSelfClose: false,
        },
      ],
      errors: [
        {
          messageId: "unexpectedAfter",
        },
      ],
    },
    {
      code: `<img src='foo.png'alt='foo'/>`,
      output: `<img src='foo.png' alt='foo'/>`,
      options: [
        {
          disallowMissing: true,
        },
      ],
      errors: [
        {
          messageId: "missingBefore",
        },
      ],
    },
    {
      code: `<img src='foo.png'\talt='foo'/>`,
      output: `<img src='foo.png' alt='foo'/>`,
      options: [
        {
          disallowTabs: true,
        },
      ],
      errors: [
        {
          messageId: "unexpectedTabBetween",
        },
      ],
    },
    {
      code: `<img\tsrc='foo.png' alt='foo'/>`,
      output: `<img src='foo.png' alt='foo'/>`,
      options: [
        {
          disallowTabs: true,
        },
      ],
      errors: [
        {
          messageId: "unexpectedTabBefore",
        },
      ],
    },
    {
      code: `<img\t/>`,
      output: `<img />`,
      options: [
        {
          disallowTabs: true,
          enforceBeforeSelfClose: true,
        },
      ],
      errors: [
        {
          messageId: "unexpectedTabBeforeSelfClose",
        },
      ],
    },
    {
      code: `<div ></div>`,
      output: `<div></div>`,
      errors: [
        {
          messageId: "unexpectedBeforeClose",
        },
      ],
    },
    {
      code: `<div foo="bar" ></div>`,
      output: `<div foo="bar"></div>`,
      errors: [
        {
          messageId: "unexpectedAfter",
        },
      ],
    },
    {
      code: `<div\t></div>`,
      output: `<div></div>`,
      errors: [
        {
          messageId: "unexpectedBeforeClose",
        },
      ],
    },
    {
      code: `<div foo="bar"\t></div>`,
      output: `<div foo="bar"></div>`,
      errors: [
        {
          messageId: "unexpectedAfter",
        },
      ],
    },
  ],
});
