const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-lang");

const ruleTester = createRuleTester();

ruleTester.run("require-lang", rule, {
  valid: [
    {
      code: `
<html lang="ko">
</html>
`,
    },
  ],
  invalid: [
    {
      code: `
<html>
</html>
`,

      errors: [
        {
          messageId: "missing",
          line: 2,
          column: 2,
          endColumn: 8,
          endLine: 2,
        },
      ],
    },
    {
      code: `
<html lang="">
</html>
`,

      errors: [
        {
          messageId: "empty",
        },
      ],
    },
    {
      code: `
<html lang="  ">
</html>
`,

      errors: [
        {
          messageId: "empty",
        },
      ],
    },
  ],
});
