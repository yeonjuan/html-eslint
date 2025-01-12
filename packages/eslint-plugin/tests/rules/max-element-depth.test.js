const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/max-element-depth");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("max-element-depth", rule, {
  valid: [
    {
      code: `<div> </div>`,
    },
  ],
  invalid: [
    {
      code: `<div><div></div></div>`,
      errors: [
        {
          message: "Unexpected use of an abstract role.",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] max-element-depth", rule, {
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
