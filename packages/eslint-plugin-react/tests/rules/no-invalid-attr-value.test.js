const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-invalid-attr-value");

const ruleTester = createRuleTester();

ruleTester.run("no-invalid-attr-value", rule, {
  valid: [
    { code: '<input type="text" />' },
    { code: '<input type="email" />' },
    { code: '<input type="number" />' },
    { code: '<input type="password" />' },
    { code: '<input type="checkbox" />' },
    { code: '<input type="radio" />' },
    { code: '<button type="button">Click</button>' },
    { code: '<button type="submit">Submit</button>' },
    { code: '<button type="reset">Reset</button>' },
    { code: '<form method="get"></form>' },
    { code: '<form method="post"></form>' },
    { code: '<a href="#" target="_blank">Link</a>' },
    { code: '<a href="#" target="_self">Link</a>' },
    { code: '<img src="image.jpg" crossorigin="anonymous" />' },
    { code: '<img src="image.jpg" loading="lazy" />' },
    { code: '<img src="image.jpg" loading="eager" />' },
    { code: '<div dir="ltr">Text</div>' },
    { code: '<div dir="rtl">Text</div>' },
    // JSX expressions should be skipped (dynamic values)
    { code: "<input type={inputType} />" },
    { code: "<button type={type}>Click</button>" },
    { code: "<img loading={loading} />" },
    { code: "<div dir={direction}>Text</div>" },
    // allow option
    {
      code: '<input type="custom-type" />',
      options: [{ allow: [{ tag: "input", attr: "type" }] }],
    },
    {
      code: '<button type="custom">Click</button>',
      options: [
        { allow: [{ tag: "button", attr: "type", valuePattern: "^custom$" }] },
      ],
    },
  ],
  invalid: [
    {
      code: '<input type="invalid-type" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<input type="txt" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<button type="invalid">Click</button>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<form method="put"></form>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<img src="image.jpg" crossorigin="invalid" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<img src="image.jpg" loading="invalid" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<div dir="invalid">Text</div>',
      errors: [{ messageId: "invalid" }],
    },
  ],
});
