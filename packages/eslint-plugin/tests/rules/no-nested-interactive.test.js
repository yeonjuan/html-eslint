const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-nested-interactive");

const ruleTester = createRuleTester();

ruleTester.run("no-nested-interactive", rule, {
  valid: [
    {
      code: `<button></button>`,
    },
  ],
  invalid: [
    {
      code: `<a href="/foo"><button> click </button></a>`,
    },
  ],
});

ruleTester.run("[template] no-nested-interactive", rule, {
  valid: [
    {
      code: `html\`<button></button>\``,
    },
  ],
  invalid: [
    {
      code: `html\`<a href="/foo"><button> click </button></a>\``,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
