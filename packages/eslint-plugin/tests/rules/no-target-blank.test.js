const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-target-blank");

const ruleTester = createRuleTester();

ruleTester.run("no-target-blank", rule, {
  valid: [
    {
      code: `<a target='_blank' rel='noreferrer' href='http://www.foo.com'></a>`,
    },
    {
      code: `<a target='_blank' rel='noreferrer noopener' href='http://www.foo.com'></a>`,
    },
    {
      code: `<a target='_blank' href='/foo'></a>`,
    },
    {
      code: `<a target='_blank' href='./foo'></a>`,
    },
  ],
  invalid: [
    {
      code: `<a target='_blank' href='http://www.foo.com'></a>`,
      errors: [
        {
          message: 'Missing `rel="noreferrer"` attribute in a tag.',
        },
      ],
    },
  ],
});
