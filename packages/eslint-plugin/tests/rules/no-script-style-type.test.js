const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-script-style-type");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-script-style-type", rule, {
  valid: [
    {
      code: '<script src="https://script.js"></script>"',
    },
    {
      code: '<script type="module" src="https://script.js"></script>',
    },
    {
      code: '<link rel="stylesheet" href="https://styles.css" />',
    },
  ],
  invalid: [
    {
      code: '<script type="text/javascript" src="https://script.js"></script>',
      output: '<script  src="https://script.js"></script>',
      errors: [
        {
          messageId: "unnecessary",
        },
      ],
    },
    {
      code: '<style type="text/css"></style>',
      output: "<style ></style>",
      errors: [
        {
          messageId: "unnecessary",
        },
      ],
    },
    {
      code: '<link type="text/css" rel="stylesheet" href="https://styles.css" />',
      output: '<link  rel="stylesheet" href="https://styles.css" />',
      errors: [
        {
          messageId: "unnecessary",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-script-style-type", rule, {
  valid: [
    {
      code: 'html`<script src="https://script.js"></script>"`',
    },
  ],
  invalid: [
    {
      code: 'html`<script type="text/javascript" src="https://script.js"></script>`',
      output: 'html`<script  src="https://script.js"></script>`',
      errors: [
        {
          messageId: "unnecessary",
        },
      ],
    },
  ],
});
