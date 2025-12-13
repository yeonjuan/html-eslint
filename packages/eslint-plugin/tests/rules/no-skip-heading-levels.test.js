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
    {
      code: `
<div>
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <h4>Heading 4</h4>
  <h5>Heading 5</h5>
  <h6>Heading 6</h6>
</div>
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
