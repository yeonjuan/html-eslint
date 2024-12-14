const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/prefer-https");

const ruleTester = createRuleTester();

ruleTester.run("quotes", rule, {
  valid: [
    {
      code: `<img src="https://image.png">`,
    },
  ],
  invalid: [
    {
      code: `<img src="http://image.png">`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
