const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/use-standard-html/use-standard-html");

const ruleTester = createRuleTester();

ruleTester.run("use-standard-html", rule, {
  valid: [
    {
      code: `<slot></slot>`,
    },
    {
      code: `<html><head></head><body></body></html>`,
    },
    {
      code: `<menu><li></li></menu>`,
    },
    {
      code: `<menu><li></li><li></li></menu>`,
    },
    {
      code: `<body></body>`,
    },
    {
      code: `<body><a></a></body>`,
    },
    {
      code: `<mark></mark>`,
    },
    {
      code: `<mark>text<br/></mark>`,
    },
  ],
  invalid: [
    // required
    {
      code: `<html><div></div></html>`,
      errors: [
        {
          messageId: "required",
        },
      ],
    },
    {
      code: `<html></html>`,
      errors: [
        {
          messageId: "required",
        },
      ],
    },
    // zeroOrMore
    {
      code: `<menu><div></div></menu>`,
      errors: [
        {
          messageId: "notAllowed",
        },
      ],
    },
    // oneOreMore
    {
      code: `<mark><div></div></mark>`,
      errors: [
        {
          messageId: "required",
        },
      ],
    },
  ],
});
