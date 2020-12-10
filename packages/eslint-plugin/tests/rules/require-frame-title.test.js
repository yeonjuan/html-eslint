const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-frame-title");

const ruleTester = createRuleTester();

ruleTester.run("require-frame-title", rule, {
  valid: [
    {
      code: `<iframe title="foo"></iframe>`,
    },
    {
      code: `
<frameset cols="10%, 90%">
<frame src="nav.html" title="bar" />
<frame src="doc.html" title="baz" />
</frameset>
`,
    },
  ],
  invalid: [
    {
      code: `<iframe></iframe>`,
      errors: [
        {
          message: "Missing `title` attribute in <iframe>.",
        },
      ],
    },
    {
      code: `<iframe title=""></iframe>`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `<iframe title></iframe>`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `
<frameset cols="10%, 90%">
<frame src="nav.html"/>
</frameset>`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: `
<frameset cols="10%, 90%">
<frame src="nav.html" title=""/>
</frameset>`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `
<frameset cols="10%, 90%">
<frame src="nav.html" title/>
</frameset>`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
