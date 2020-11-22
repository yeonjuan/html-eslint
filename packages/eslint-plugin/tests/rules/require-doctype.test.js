const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-doctype");

const ruleTester = createRuleTester();

ruleTester.run("require-doctype", rule, {
  valid: [
    {
      code: `
<!DOCTYPE html>
<html>
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
      output: `
<!DOCTYPE html>
<html>
</html>
`,
      filename: "test.html",
      errors: [
        {
          messageId: "missingDoctype",
        },
      ],
    },
  ],
});
