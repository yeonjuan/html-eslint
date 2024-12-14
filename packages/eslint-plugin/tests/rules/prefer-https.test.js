const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/prefer-https");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("prefer-https", rule, {
  valid: [
    {
      code: `<script></script>`,
    },
    {
      code: `<script src="https://script.js">`,
    },
    {
      code: `<img src="https://image.png">`,
    },
    {
      code: `<iframe src="/absolute.html"></iframe>`,
    },
    {
      code: `<audio src="relative.mp3"></iframe>`,
    },
    {
      code: `<video src="./relative.mp3"></iframe>`,
    },
    {
      code: `<link href="https://foo.css" rel="stylesheet" />`,
    },
    {
      code: `<object type="application/pdf" data="/media/examples/In-CC0.pdf"></object>`,
    },
  ],
  invalid: [
    {
      code: `<script src="http://script.js">`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `<img src="http://image.png">`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `<link href="http://foo.css" rel="stylesheet" />`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `<object type="application/pdf" data="http://media/examples/In-CC0.pdf"></object>`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] prefer-https", rule, {
  valid: [
    {
      code: "html`<script></script>`",
    },
    {
      code: `html\`<img src="\${variableLink}">\``,
    },
  ],
  invalid: [
    {
      code: `html\`<script src="http://script.js">\``,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
