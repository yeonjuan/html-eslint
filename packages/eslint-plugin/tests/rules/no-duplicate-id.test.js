const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-id");

const ruleTester = createRuleTester();

ruleTester.run("no-duplicate-id", rule, {
  valid: [
    {
      code: `
<html>
<body>
  <div id = "foo"></div>
  <div id = "bar"></div>
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
  <div id = "foo"></div>
  <div id = "foo"></div>
</body>
</html>
`,
      errors: [
        {
          messageId: "duplicateId",
        },
        {
          message: "The id 'foo' is duplicated.",
        },
      ],
    },
    {
      code: `
<html>
<body>
  <div id = "foo"></div>
  <a id = "foo"></div>
</body>
</html>
`,

      errors: [
        {
          messageId: "duplicateId",
          line: 4,
        },
        {
          messageId: "duplicateId",
          line: 5,
        },
      ],
    },
  ],
});
