const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-attrs");
const { TEMPLATE_ENGINE_SYNTAX } = require("@html-eslint/parser");

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
    {
      code: `
      <input
    {{#aria_label}}aria-label="{{aria_label}}"{{/aria_label}}
    {{^aria_label}}aria-labelledby="pl-big-o-input-{{uuid}}-label"{{/aria_label}}
/>
      `,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
    },
    // The same attribute name in different Twig if/else branches on the same
    // tag is not a real duplicate — only one branch renders at runtime.
    {
      code: `<span {% if cond %}class="active"{% else %}class="inactive"{% endif %}>text</span>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
    },
    // Three branches: still mutually exclusive.
    {
      code: `<a {% if lang == "en" %}lang="en"{% elseif lang == "fi" %}lang="fi"{% else %}lang="sv"{% endif %} href="/">home</a>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
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
    {
      code: `<div foo foo {{aa}} {{aa}}> </div>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
      errors: [
        {
          message: "The attribute 'foo' is duplicated.",
          suggestions: [
            {
              messageId: "removeAttr",
              data: {
                attrName: "foo",
              },
              output: `<div foo  {{aa}} {{aa}}> </div>`,
            },
          ],
        },
      ],
    },
    // Attributes in two separate Twig if-blocks (not one if/else) can both
    // render at the same time and must still be reported.
    {
      code: `<span {% if c1 %}class="a"{% endif %} {% if c2 %}class="b"{% endif %}>text</span>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
      errors: [
        {
          message: "The attribute 'class' is duplicated.",
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
