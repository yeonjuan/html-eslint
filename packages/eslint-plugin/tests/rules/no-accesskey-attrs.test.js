const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-accesskey-attrs");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-accesskey-attrs", rule, {
  valid: [
    {
      code: `<div></div>`,
    },
  ],
  invalid: [
    {
      code: `<div accesskey="h"></div>`,
      errors: [
        {
          message: "Unexpected use of accesskey attribute.",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-accesskey-attrs", rule, {
  valid: [
    {
      code: `html\`<div></div>\``,
    },
  ],
  invalid: [
    {
      code: `html\`<div accesskey="h"></div>\``,
      errors: [
        {
          message: "Unexpected use of accesskey attribute.",
        },
      ],
    },
  ],
});
