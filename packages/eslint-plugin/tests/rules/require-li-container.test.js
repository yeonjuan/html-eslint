const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-li-container");

const ruleTester = createRuleTester();

ruleTester.run("require-li-container", rule, {
  valid: [
    {
      code: `
<ul>
      <li>list</li>
</ul>
`,
    },
    {
      code: `
<ol>
      <li>list</li>
</ol>
`,
    },
    {
      code: `
<menu>
      <li>list</li>
</menu>
`,
    },
  ],
  invalid: [
    {
      code: `
<div>
      <li>list</li>
</div>
`,

      errors: [
        {
          messageId: "invalid",
        },
      ],
    },
    {
      code: `
<li>list</li>
`,

      errors: [
        {
          messageId: "invalid",
        },
      ],
    },
  ],
});
