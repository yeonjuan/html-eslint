const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/lowercase");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("lowercase", rule, {
  valid: [
    {
      code: "<div></div>",
    },
    {
      code: "<div id='foo'></div>",
    },
    {
      code: "<script></script>",
    },
    {
      code: "<style></style>",
    },
    // svg
    {
      code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"></svg>`,
    },
    {
      code: `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="100">
        <animate
          attributeType="XML"
          attributeName="y"
          from="0"
          to="50"
          dur="1s"
          repeatCount="5" />
      </rect>
      <rect x="120" y="0" width="100" height="100">
        <animate
          attributeType="XML"
          attributeName="y"
          from="0"
          to="50"
          dur="1s"
          repeatCount="indefinite" />
      </rect>
    </svg>`,
    },
    {
      code: `<svg viewBox="0 0 100 100">
  <clipPath id="myClip">
    <circle cx="40" cy="35" r="35" />
  </clipPath>
</svg>
`,
    },
    {
      code: "<div {{ID}}></div>",
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
      code: '<IMG src="img.png">',
      output: '<img src="img.png">',
      errors: [
        {
          message: "'IMG' is not in lowercase.",
        },
      ],
    },
    {
      code: "<Script></Script>",
      output: "<script></script>",
      errors: [
        {
          message: "'Script' is not in lowercase.",
        },
      ],
    },
    {
      code: "<Style type='text/css'></Style>",
      output: "<style type='text/css'></style>",
      errors: [
        {
          message: "'Style' is not in lowercase.",
        },
      ],
    },
    {
      code: "<sTyle type='text/css'></sTyle>",
      output: "<style type='text/css'></style>",
      errors: [
        {
          message: "'sTyle' is not in lowercase.",
        },
      ],
    },
    {
      code: "<div ID='1'></div>",
      output: "<div id='1'></div>",
      errors: [
        {
          message: "'ID' is not in lowercase.",
        },
      ],
    },
    {
      code: `<svg xmlns="http://www.w3.org/2000/svg" STYLE="" viewBox="0 0 200 200"></svg>`,
      output: `<svg xmlns="http://www.w3.org/2000/svg" style="" viewBox="0 0 200 200"></svg>`,
      errors: [
        {
          message: "'STYLE' is not in lowercase.",
        },
      ],
    },
    {
      code: `<SVG></SVG>`,
      output: `<svg></svg>`,
      errors: [
        {
          message: "'SVG' is not in lowercase.",
        },
      ],
    },
    {
      code: "<div ID={{ID}}></div>",
      output: "<div id={{ID}}></div>",
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: {
            "{{": "}}",
          },
        },
      },
      errors: [
        {
          message: "'ID' is not in lowercase.",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] lowercase", rule, {
  valid: [
    {
      code: `html\`<svg xmlns="http://www.w3.org/2000/svg" style="" viewBox="0 0 200 200"></svg>\``,
    },
    {
      code: `const code = /* html */\`<svg xmlns="http://www.w3.org/2000/svg" style="" viewBox="0 0 200 200"></svg>\``,
    },
    {
      code: `
const KEY = 'id';
const code = /* html */\`<div \${KEY}></div>\`
      `,
    },
  ],
  invalid: [
    {
      code: `html\`<svg xmlns="http://www.w3.org/2000/svg" STYLE="" viewBox="0 0 200 200"></svg>\``,
      output: `html\`<svg xmlns="http://www.w3.org/2000/svg" style="" viewBox="0 0 200 200"></svg>\``,
      errors: [
        {
          message: "'STYLE' is not in lowercase.",
        },
      ],
    },
    {
      code: `const code = /* html */\`<svg xmlns="http://www.w3.org/2000/svg" STYLE="" viewBox="0 0 200 200"></svg>\``,
      output: `const code = /* html */\`<svg xmlns="http://www.w3.org/2000/svg" style="" viewBox="0 0 200 200"></svg>\``,
      errors: [
        {
          message: "'STYLE' is not in lowercase.",
        },
      ],
    },
  ],
});
