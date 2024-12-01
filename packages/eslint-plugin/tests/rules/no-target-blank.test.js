const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-target-blank");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

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

templateRuleTester.run("[template] no-target-blank", rule, {
  valid: [
    {
      code: "html`<a target='_blank' rel='noreferrer' href='http://www.foo.com'></a>`",
    },
    {
      code: "html`<a target='${target}' href='http://www.foo.com'></a>`",
    },
    {
      code: "html`<a target='_blank' rel='${rel}' href='http://www.foo.com'></a>`",
    },
  ],
  invalid: [
    {
      code: "html`<a target='_blank' href='http://www.foo.com'></a>`",
      errors: [
        {
          message: 'Missing `rel="noreferrer"` attribute in a tag.',
        },
      ],
    },
  ],
});
