const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/quotes");

const ruleTester = createRuleTester();

ruleTester.run("quotes", rule, {
  valid: [
    {
      code: `<div id = " foo ">`,
    },
    {
      code: `<div id = "foo ">`,
    },
    {
      code: `<div id = " foo">`,
    },
    {
      code: `
<div id="
foo">
`,
    },
    {
      code: `<div id="foo">`,
    },

    {
      code: `<div id="">`,
    },

    {
      code: `<div id>`,
    },
    {
      code: `<div aa>`,
    },
    {
      code: `<div id='foo'>`,
      options: ["single"],
    },
    {
      code: `<img src="?size=50&amp;default=retro">`,
    },
    {
      code: `<img src='?size=50&amp;default=retro'>`,
      options: ["single"],
    },
  ],
  invalid: [
    {
      code: `<div id='foo'>`,
      output: `<div id="foo">`,
      errors: [
        {
          message: "Expected double(\") quotes but found single(').",
        },
      ],
    },
    {
      code: `<div id='
foo'>`,
      output: `<div id="
foo">`,
      errors: [
        {
          message: "Expected double(\") quotes but found single(').",
        },
      ],
    },
    {
      code: `<div id='foo' style='bar'>`,
      output: `<div id="foo" style="bar">`,
      errors: [
        {
          messageId: "unexpected",
        },
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `<div id="foo">`,
      output: `<div id='foo'>`,
      options: ["single"],
      errors: [
        {
          message: "Expected single(') quotes but found double(\").",
        },
      ],
    },
    {
      code: `<div id=foo>`,
      output: `<div id="foo">`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: `<div id=
foo>`,
      output: `<div id=
"foo">`,
      errors: [
        {
          message: 'Expected double(") quotes but no quotes found.',
        },
      ],
    },
    {
      code: `<div id=  foo>`,
      output: `<div id=  "foo">`,
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: `<img src='?size=50&amp;default=retro'>`,
      output: `<img src="?size=50&amp;default=retro">`,
      options: ["double"],
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `<img src = '?size=50&amp;default=retro'>`,
      output: `<img src = "?size=50&amp;default=retro">`,
      options: ["double"],
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
