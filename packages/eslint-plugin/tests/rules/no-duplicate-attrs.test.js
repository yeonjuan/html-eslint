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
    // Twig doesn't require whitespace after a block tag (e.g. {%if cond%} is
    // valid, identical to {% if cond %}), and this is verified to work
    // without it: es-html-parser glues the token's literal text onto the
    // following attribute key when there's no separating space, but the
    // rule reconstructs the real attribute name from `key.parts` rather than
    // relying on `key.value`, so spacing makes no difference to detection.
    {
      code: `<span {%if cond%}class="active"{%else%}class="inactive"{%endif%}>text</span>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
    },
    // Three branches: still mutually exclusive.
    {
      code: `<a {%if lang=="en"%}lang="en"{%elseif lang=="fi"%}lang="fi"{%else%}lang="sv"{%endif%} href="/">home</a>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
    },
    // Two separate attributes, each with their own if/else branches.
    // Each attribute's second branch triggers the prevList.push(attr) path.
    {
      code: `<div {%if x%}data-id="1"{%else%}data-id="2"{%endif%} {%if y%}aria-label="x"{%else%}aria-label="y"{%endif%}>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
    },
    // HANDLEBAR_EXTENDED: same if/else suppression via {{#if}}/{{else}}/{{/if}}.
    {
      code: `<span {{#if cond}}class="a"{{else}}class="b"{{/if}}>text</span>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.HANDLEBAR_EXTENDED,
        },
      },
    },
    // A key with a genuinely dynamic embedded interpolation (not a
    // branch-control token) must remain conservatively skipped rather than
    // compared — its real name can't be known statically, so it must never
    // be treated as either a suppressible or a reportable duplicate.
    {
      code: `<div data-{{a}}="1" data-{{b}}="2">text</div>`,
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
    // Genuine duplicate with TWIG configured — no template blocks in the
    // source so branchSegments is empty; the error fires normally.
    {
      code: `<div class="a" class="b">text</div>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
      errors: [
        {
          message: "The attribute 'class' is duplicated.",
          suggestions: [
            {
              messageId: "removeAttr",
              data: { attrName: "class" },
              output: `<div class="a" >text</div>`,
            },
          ],
        },
      ],
    },
    // Genuine duplicate with HANDLEBAR_EXTENDED configured — both attributes
    // are plain HTML (no template blocks), so not exclusive; error fires.
    {
      code: `<div class="a" class="b">text</div>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.HANDLEBAR_EXTENDED,
        },
      },
      errors: [
        {
          message: "The attribute 'class' is duplicated.",
          suggestions: [
            {
              messageId: "removeAttr",
              data: { attrName: "class" },
              output: `<div class="a" >text</div>`,
            },
          ],
        },
      ],
    },
    // Same attribute key in two SEPARATE if-blocks (not one if/else) can
    // both render simultaneously (e.g. both conditions true), so this is a
    // genuine duplicate and must still be reported even with a branch-aware
    // engine configured — regardless of Twig's optional whitespace after
    // block tags. areInMutuallyExclusiveBranches correctly returns false for
    // this pair since they belong to different if-block groups (verified
    // against the real parser).
    {
      code: `<div {%if c1%}class="a"{%endif%}{%if c2%}class="b"{%endif%}>text</div>`,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
      errors: [
        {
          message: "The attribute 'class' is duplicated.",
          suggestions: [
            {
              messageId: "removeAttr",
              data: { attrName: "class" },
              output: `<div {%if c1%}class="a"{%endif%}>text</div>`,
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
