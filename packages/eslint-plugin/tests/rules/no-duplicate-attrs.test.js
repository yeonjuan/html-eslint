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
    // https://github.com/yeonjuan/html-eslint/issues/110
    {
      code: `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-line-cap="round" stroke-linejoin="round"
  class="feather feather-home"
  >
	<path d="M3 919"></path>
	<polyline points="9 22"></polyline>
</svg>
      `
        .split("\n")
        .join("\r\n"),
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
    // https://github.com/yeonjuan/html-eslint/issues/110
    {
      code: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      class="feather feather-home"
      class="feather feather-home"
      >
      <path d="M3 919"></path>
      <polyline points="9 22"></polyline>
    </svg>
          `
        .split("\n")
        .join("\r\n"),
      errors: [
        {
          message: "The attribute 'class' is duplicated.",
        },
      ],
    },
  ],
});
