const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/quotes");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

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
    // https://github.com/yeonjuan/html-eslint/issues/95
    {
      code: `<div id='"foo"'></div>`,
    },
    {
      code: `<div id="'foo'"></div>`,
      options: ["single"],
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
    {
      code: `<img src={{foo}}>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
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

templateRuleTester.run("[template] quotes", rule, {
  valid: [
    {
      code: `html\`<div id = " foo ">\``,
    },
    {
      code: `html\`<div id = "\${foo}">\``,
    },
    {
      code: `
const handler = () => {};
html\`<div onclick=\${handler}></div>\``,
    },
    {
      code: `html\`<div id = "\${foo}">\``,
      options: ["double", { enforceTemplatedAttrValue: true }],
    },
    {
      code: `html\`<div id = '\${foo}'>\``,
      options: ["single", { enforceTemplatedAttrValue: true }],
    },
  ],
  invalid: [
    {
      code: `html\`<div id = ' foo '>\``,
      output: `html\`<div id = " foo ">\``,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `html\`<div id = \${foo}>\``,
      output: `html\`<div id = "\${foo}">\``,
      options: ["double", { enforceTemplatedAttrValue: true }],
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
    {
      code: `html\`<div id = '\${foo}'>\``,
      output: `html\`<div id = "\${foo}">\``,
      options: ["double", { enforceTemplatedAttrValue: true }],
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `html\`<div id = prefix_\${foo}>\``,
      output: `html\`<div id = 'prefix_\${foo}'>\``,
      options: ["single", { enforceTemplatedAttrValue: true }],
      errors: [
        {
          messageId: "missing",
        },
      ],
    },
  ],
});
