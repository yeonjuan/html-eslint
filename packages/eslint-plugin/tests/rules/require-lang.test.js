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
          messageId: "missingLangAttr"
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
          messageId: "missingLangValue"
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
          messageId: "missingLangValue"
        }
      ]
    }
  ],
});
