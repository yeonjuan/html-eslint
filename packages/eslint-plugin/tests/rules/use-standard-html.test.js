const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/use-standard-html/use-standard-html");

const ruleTester = createRuleTester();

ruleTester.run("use-standard-html", rule, {
  valid: [
    {
      code: `<slot></slot>`,
    },
    {
      code: `<html><head></head><body></body></html>`,
    },
    {
      code: `<menu><li></li></menu>`,
    },
    {
      code: `<menu><li></li><li></li></menu>`,
    },
    {
      code: `<body></body>`,
    },
    {
      code: `<body><a></a></body>`,
    },
    {
      code: `<mark></mark>`,
    },
    {
      code: `<mark>text<br/></mark>`,
    },
    {
      code: `<fieldset></fieldset>`,
    },
    {
      code: `<fieldset><legend></legend></fieldset>`,
    },
    {
      code: `<fieldset>
        <!-- comment -->
        <legend></legend>
      </fieldset>`,
    },
    {
      code: '<template id="template"><p>Smile!</p></template>',
    },
    {
      code: "<custom-element>content</custom-element>",
    },
    {
      code: "<head><style> div {} </style> <script> console.log('hello'); </script></head>",
    },
  ],
  invalid: [
    // required
    {
      code: `<html><div></div></html>`,
      errors: [
        {
          messageId: "notAllowed",
        },
      ],
    },
    {
      code: `<html>
      <!--comment-->
      <div></div>
      </html>`,
      errors: [
        {
          messageId: "notAllowed",
        },
      ],
    },
    {
      code: `<html></html>`,
      errors: [
        {
          messageId: "required",
        },
      ],
    },
    {
      code: `<html><script></script></html>`,
      errors: [
        {
          messageId: "notAllowed",
        },
      ],
    },
    // zeroOrMore
    {
      code: `<menu><div></div></menu>`,
      errors: [
        {
          messageId: "notAllowed",
        },
      ],
    },
    {
      code: `<menu>
      <div></div>
      <!-- comment -->
      </menu>`,
      errors: [
        {
          messageId: "notAllowed",
        },
      ],
    },
    // oneOreMore
    {
      code: `<mark><div></div></mark>`,
      errors: [
        {
          messageId: "notAllowed",
        },
      ],
    },
    {
      code: `<mark>
      <div></div>
      </mark>`,
      errors: [
        {
          messageId: "notAllowed",
        },
      ],
    },
    {
      code: `<head>
      </head>`,
      errors: [
        {
          messageId: "required",
        },
      ],
    },
    {
      code: `<fieldset><base></base></fieldset>`,
      errors: [
        {
          messageId: "notAllowed",
        },
      ],
    },
  ],
});
