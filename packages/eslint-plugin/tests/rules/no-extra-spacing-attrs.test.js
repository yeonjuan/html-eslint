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
          messageId: "unexpectBetween",
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
          messageId: "unexpectBetween",
        },
        {
          messageId: "unexpectBetween",
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
          messageId: "unexpectAfter",
        },
        {
          messageId: "unexpectBetween",
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
          messageId: "unexpectBefore",
        },
        {
          messageId: "unexpectAfter",
        },
        {
          messageId: "unexpectBetween",
        },
      ],
    },
  ],
});
