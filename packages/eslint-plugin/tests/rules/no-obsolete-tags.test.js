const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-obsolete-tags");
const { OBSOLETE_TAGS } = require("../../lib/constants");

const ruleTester = createRuleTester();

ruleTester.run("no-obsolete-tags", rule, {
  valid: [
    {
      code: `
<html>
<body>
<h1>one heading</h1>
</body>
</html>
`,
    },
  ],
  invalid: [
    ...OBSOLETE_TAGS.filter((tag) => tag !== "frame").map((tag) => ({
      code: `<${tag}></${tag}>`,
      errors: [
        {
          message: `Unexpected use of obsolete tag <${tag}>`,
        },
      ],
    })),
    {
      code: `
<frameset cols="25%,*,25%">
    <frame name="left" src="/html/intro"/>
</frameset>`,
      errors: [
        {
          messageId: "unexpected",
        },
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
