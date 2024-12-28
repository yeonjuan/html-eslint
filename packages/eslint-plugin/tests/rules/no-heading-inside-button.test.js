const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-heading-inside-button");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-heading-inside-button", rule, {
  valid: [
    {
      code: `<button>click</button>`,
    },
    {
      code: `<button><span>click</span></button>`,
    },
    {
      code: `<div><h1>title</h1></div>`,
    },
  ],
  invalid: [
    {
      code: `<button><h1>title</h1></button>`,

      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `<button><h6>title</h6></button>`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `<button><span><h1>title</h1></span></button>`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-heading-inside-button", rule, {
  valid: [
    {
      code: `html\`<button>click</button>\``,
    },
  ],
  invalid: [
    {
      code: `html\`<button><h1>click</h1></button>\``,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
