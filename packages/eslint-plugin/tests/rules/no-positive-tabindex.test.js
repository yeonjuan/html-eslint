const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-positive-tabindex");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-positive-tabindex", rule, {
  valid: [
    {
      code: `<span tabindex="0">foo</span>`,
    },
    {
      code: `<span tabindex="-1">foo</span>`,
    },
  ],
  invalid: [
    {
      code: `<span tabindex="1">foo</span>`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `<span tabindex="2">foo</span>`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-positive-tabindex", rule, {
  valid: [
    {
      code: `html\`<span tabindex="0">foo</span>\``,
    },
    {
      code: `html\`<span tabindex="\${index}">foo</span>\``,
    },
  ],
  invalid: [
    {
      code: `html\`<span tabindex="1">foo</span>\``,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
