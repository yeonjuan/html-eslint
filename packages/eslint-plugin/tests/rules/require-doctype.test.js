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

      errors: [
        {
          messageId: "missingDoctype",
        },
      ],
    },
  ],
});
