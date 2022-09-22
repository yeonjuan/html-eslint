const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-trailing-spaces");

const ruleTester = createRuleTester();

ruleTester.run("no-tailing-spaces", rule, {
  valid: [
    {
      code: "<div></div>",
    },
    {
      code: "<div></div>\n",
    },
    {
      code: "<div></div>\r\n",
    },
  ],
  invalid: [
    {
      code: "<div></div>  ",
      output: "<div></div>",
      errors: [
        {
          messageId: "trailingSpace",
        },
      ],
    },
    {
      code: "<div></div>  \n",
      output: "<div></div>\n",
      errors: [
        {
          messageId: "trailingSpace",
        },
      ],
    },
  ],
});
