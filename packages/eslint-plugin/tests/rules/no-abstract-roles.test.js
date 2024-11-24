const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-abstract-roles");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-abstract-roles", rule, {
  valid: [
    {
      code: `<div role="any"> </div>`,
    },
  ],
  invalid: [
    {
      code: `<img role="command">`,
      errors: [
        {
          message: "Unexpected use of an abstract role.",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-abstract-roles", rule, {
  valid: [
    {
      code: `html\`<div role="any"> </div>\`;`,
    },
  ],
  invalid: [
    {
      code: `html\`<img role="command">\`;`,
      errors: [
        {
          message: "Unexpected use of an abstract role.",
        },
      ],
    },
  ],
});
