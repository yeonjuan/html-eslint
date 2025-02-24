const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/indent");
const frontmatter = require("../../lib/processors/frontmatter");
const ruleTester = createRuleTester(undefined, frontmatter);

ruleTester.run("[frontmatter] indent", rule, {
  valid: [
    {
      code: `---
name: indent
items:
  - 1
  - 2
---
<div></div>
`,
      processor: frontmatter,
    },
  ],
  invalid: [
    {
      code: `---
name: indent
items:
  - 1
  - 2
---
<div>
<div></div>
</div>
`,
      output: `---
name: indent
items:
  - 1
  - 2
---
<div>
    <div></div>
</div>
`,
      processor: frontmatter,
      errors: [
        {
          messageId: "wrongIndent",
        },
      ],
    },
  ],
});
