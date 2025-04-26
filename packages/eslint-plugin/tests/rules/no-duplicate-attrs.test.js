const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-attrs");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-duplicate-attrs", rule, {
  valid: [
    {
      code: `<div> </div>`,
    },
    {
      code: `<div foo="foo"> </div>`,
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
          suggestions: [
            {
              messageId: "removeAttr",
              data: {
                attrName: "foo",
              },
              output: `<div foo="foo1" > </div>`,
            },
          ],
        },
      ],
    },
    {
      code: `<div foo foo> </div>`,
      errors: [
        {
          message: "The attribute 'foo' is duplicated.",
          suggestions: [
            {
              messageId: "removeAttr",
              data: {
                attrName: "foo",
              },
              output: `<div foo > </div>`,
            },
          ],
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
          suggestions: [
            {
              messageId: "removeAttr",
              output: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
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
        },
      ],
    },
    {
      code: `
<div id="1"
     ID="1"
     Id="1"
 ></div>
      `,
      errors: [
        {
          message: "The attribute 'ID' is duplicated.",
          suggestions: [
            {
              messageId: "removeAttr",
              output: `
<div id="1"
     
     Id="1"
 ></div>
      `,
            },
          ],
        },
        {
          message: "The attribute 'Id' is duplicated.",
          suggestions: [
            {
              messageId: "removeAttr",
              output: `
<div id="1"
     ID="1"
     
 ></div>
      `,
            },
          ],
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-duplicate-attrs", rule, {
  valid: [
    {
      code: `html\`<div> </div>\``,
    },
    {
      code: `html\`<div foo="foo"> </div>\``,
    },
    {
      code: `html\`<div foo="foo" bar="bar"> </div>\``,
    },
  ],
  invalid: [
    {
      code: `html\`<div foo="\${id1}" foo="\${id2}"> </div>\`;`,
      errors: [
        {
          message: "The attribute 'foo' is duplicated.",
          suggestions: [
            {
              messageId: "removeAttr",
              output: `html\`<div foo="\${id1}" > </div>\`;`,
            },
          ],
        },
      ],
    },
    {
      code: `html\`<div foo foo> </div>\`;`,
      errors: [
        {
          message: "The attribute 'foo' is duplicated.",
          suggestions: [
            {
              messageId: "removeAttr",
              output: `html\`<div foo > </div>\`;`,
            },
          ],
        },
      ],
    },
  ],
});
