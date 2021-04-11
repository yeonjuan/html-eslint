const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-attrs");

const ruleTester = createRuleTester();

ruleTester.run("no-duplicate-attrs", rule, {
  valid: [
    {
      code: `<div> </div>`,
    },
    {
      code: `<div foo="foo" </div>`,
    },
    {
      code: `<div foo="foo" bar="bar"> </div>`,
    },
  ],
  invalid: [
    {
      code: `<div foo="foo1" foo="foo2"> </div>`,
      errors: [
        {
          message: "The attribute 'foo' is duplicated.",
        },
      ],
    },
    {
      code: `<div foo foo> </div>`,
      errors: [
        {
          message: "The attribute 'foo' is duplicated.",
        },
      ],
    },
  ],
});
