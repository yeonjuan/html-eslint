const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/css-no-empty-blocks");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("css-no-empty-blocks", rule, {
  valid: [],
  invalid: [
    {
      code: "<style> a { } </style>",
      errors: [
        {
          messageId: "emptyBlock",
          line: 1,
          column: 4,
          endLine: 1,
          endColumn: 7,
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] css-no-empty-blocks", rule, {
  valid: [],
  invalid: [],
});
