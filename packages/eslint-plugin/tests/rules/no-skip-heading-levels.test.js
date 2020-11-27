const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-skip-heading-levels");

const ruleTester = createRuleTester();

ruleTester.run("no-skip-heading-levels", rule, {
  valid: [
    {
      code: `
<html>
<body>
<h1>one heading</h1>
</body>
</html>
`,
    },
    {
      code: `
<html>
<body>
<h1>one heading</h1>
<h2>one heading</h2>
<h3>one heading</h3>
</body>
</html>
`,
    },
    {
      code: `
<html>
<body>
<h1>one heading</h1>
<h2>one heading</h2>
<h2>one heading</h2>
</body>
</html>
`,
    },
    {
      code: `
<html>
<body>
<h1>one heading</h1>
<h2>one heading</h2>
<h1>one heading</h1>
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
<h1>one heading</h1>
<h3>one heading</h3>
</body>
</html>
`,

      errors: [
        {
          message: "Unexpected skipping heading level. <h2> is expected",
        },
      ],
    },
  ],
});
