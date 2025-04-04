const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/use-baseline");

const ruleTester = createRuleTester();

ruleTester.run("use-baseline", rule, {
  valid: [
    {
      code: `<slot></slot>`,
    },
  ],
  invalid: [
    {
      code: `<slot></slot>`,
      errors: [
        {
          message: "Element 'slot' is not a 2001 available baseline feature.",
        },
      ],
      options: [
        {
          available: 2001,
        },
      ],
    },
    {
      code: `<span slot="username">Jane Doe</span>`,
      errors: [
        {
          message: "Attribute 'slot' is not a 2019 available baseline feature.",
        },
      ],
      options: [
        {
          available: 2019,
        },
      ],
    },
    {
      code: `<button popovertarget="mypopover" popovertargetaction="show"></button>`,
      errors: [
        {
          messageId: "notBaselineAttribute",
        },
        {
          messageId: "notBaselineAttribute",
        },
      ],
      options: [
        {
          available: 2019,
        },
      ],
    },
    {
      code: ` <template shadowrootmode="open"></template>`,
      errors: [
        {
          message:
            "Attribute 'shadowrootmode' is not a widely available baseline feature.",
        },
      ],
    },
    {
      code: `<div contenteditable="plaintext-only"></div>`,
      errors: [
        {
          message:
            "Attribute 'contenteditable=\"plaintext-only\"' is not a widely available baseline feature.",
        },
      ],
    },
  ],
});
