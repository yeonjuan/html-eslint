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
    {
      code: "<div>\n  text\n  </div>\n",
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
    {
      code: "<div>  \n  text\n  </div>",
      output: "<div>\n  text\n  </div>",
      errors: [
        {
          messageId: "trailingSpace",
        },
      ],
    },
    {
      code: `<div>${"  "}
    text
</div>${"  "}
`,
      output: `<div>
    text
</div>
`,
      errors: [
        {
          messageId: "trailingSpace",
        },
        {
          messageId: "trailingSpace",
        },
      ],
    },
  ],
});
