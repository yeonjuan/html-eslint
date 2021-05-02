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
  ],
});
