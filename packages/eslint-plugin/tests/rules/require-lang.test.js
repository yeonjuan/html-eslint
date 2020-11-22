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
      filename: "test.html",
    },
  ],
  invalid: [
    {
      code: `
<html>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "missingLang",
          line: 2,
          endLine: 4,
        }
      ]
    },
    {
      code: `
<html lang="">
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "invalidLang"
        }
      ]
    },
    {
      code: `
<html lang="  ">
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "invalidLang"
        }
      ]
    },
    {
      code: `
<html lang="unkown">
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "invalidLang"
        }
      ]
    }
  ],
});
