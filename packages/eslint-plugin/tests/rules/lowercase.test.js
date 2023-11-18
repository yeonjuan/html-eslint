const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/lowercase");

const ruleTester = createRuleTester();

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
  ],
});
