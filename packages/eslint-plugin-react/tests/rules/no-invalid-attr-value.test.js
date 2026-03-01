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
    { code: "<input {...props} />" },
    { code: '<button type="button">Click</button>' },
    { code: '<button type="submit">Submit</button>' },
    { code: '<button type="reset">Reset</button>' },
    { code: '<form method="get"></form>' },
    { code: '<form method="post"></form>' },
    { code: '<a href="#" target="_blank">Link</a>' },
    { code: '<a href="#" target="_self">Link</a>' },
    { code: '<img src="image.jpg" crossOrigin="anonymous" />' },
    { code: '<img src="image.jpg" loading="lazy" />' },
    { code: '<img src="image.jpg" loading="eager" />' },
    { code: '<div dir="ltr">Text</div>' },
    { code: '<div dir="rtl">Text</div>' },
    { code: "<input type={inputType} />" },
    { code: "<button type={type}>Click</button>" },
    { code: "<img loading={loading} />" },
    { code: "<div dir={direction}>Text</div>" },
    { code: '<input type={"text"} />' },
    { code: '<button type={"button"}>Click</button>' },
    { code: '<img loading={"lazy"} />' },
    { code: '<div dir={"ltr"}>Text</div>' },
    { code: "<input type={`text`} />" },
    { code: "<button type={`button`}>Click</button>" },
    { code: "<img loading={`lazy`} />" },
    { code: "<div dir={`ltr`}>Text</div>" },
    { code: "<input type={`invalid-${type}`} />" },
    { code: '<custom.input type="invalid-type" />' },
    { code: "<script async />" },
    { code: "<script async={true} />" },
    { code: "<script async={false} />" },
    { code: "<script async={undefined} />" },
    { code: "<script async={null} />" },
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
    {
      code: "<input type={false} />",
    },
    {
      code: "<input type={null} />",
    },
    {
      code: "<input type={undefined} />",
    },
  ],
  invalid: [
    {
      code: '<input type="invalid-type" />',
      errors: [
        {
          messageId: "invalid",
          data: {
            value: "invalid-type",
            attr: "type",
            element: "input",
            suggestion:
              'Value "invalid-type" is not a valid keyword. Expected one of: hidden, text, search, tel, url, email, password, date, month, week, time, datetime-local, number, range, color, checkbox, radio, file, submit, image, reset, button',
          },
        },
      ],
    },
    {
      code: '<input type="txt" />',
      errors: [
        {
          messageId: "invalid",
          data: {
            value: "txt",
            attr: "type",
            element: "input",
            suggestion:
              'Value "txt" is not a valid keyword. Expected one of: hidden, text, search, tel, url, email, password, date, month, week, time, datetime-local, number, range, color, checkbox, radio, file, submit, image, reset, button',
          },
        },
      ],
    },
    {
      code: '<button type="invalid">Click</button>',
      errors: [
        {
          messageId: "invalid",
          data: {
            value: "invalid",
            attr: "type",
            element: "button",
            suggestion:
              'Value "invalid" is not a valid keyword. Expected one of: submit, reset, button',
          },
        },
      ],
    },
    {
      code: '<form method="put"></form>',
      errors: [
        {
          messageId: "invalid",
          data: {
            value: "put",
            attr: "method",
            element: "form",
            suggestion:
              'Value "put" is not a valid keyword. Expected one of: get, post, dialog',
          },
        },
      ],
    },
    {
      code: '<img src="image.jpg" crossOrigin="invalid" />',
      errors: [
        {
          messageId: "invalid",
          data: {
            value: "invalid",
            attr: "crossOrigin",
            element: "img",
            suggestion:
              'Value "invalid" is not a valid keyword. Expected one of: , anonymous, use-credentials',
          },
        },
      ],
    },
    {
      code: '<img src="image.jpg" loading="invalid" />',
      errors: [
        {
          messageId: "invalid",
          data: {
            value: "invalid",
            attr: "loading",
            element: "img",
            suggestion:
              'Value "invalid" is not a valid keyword. Expected one of: eager, lazy',
          },
        },
      ],
    },
    {
      code: '<div dir="invalid">Text</div>',
      errors: [
        {
          messageId: "invalid",
          data: {
            value: "invalid",
            attr: "dir",
            element: "div",
            suggestion:
              'Value "invalid" is not a valid keyword. Expected one of: ltr, rtl, auto',
          },
        },
      ],
    },
    // JSX expression container with invalid string literal - should report
    {
      code: '<input type={"invalid-type"} />',
      errors: [{ messageId: "invalid" }],
    },
    // JSX expression container with invalid template literal - should report
    {
      code: "<input type={`invalid-type`} />",
      errors: [{ messageId: "invalid" }],
    },
    { code: "<script async={1} />", errors: [{ messageId: "invalid" }] },
    { code: "<script async={'false'} />", errors: [{ messageId: "invalid" }] },
  ],
});

ruleTester.run("no-invalid-attr-value (custom components)", rule, {
  valid: [
    { code: '<Input type="invalid-type" />' },
    { code: '<Textarea type="invalid" />' },
    { code: '<MyButton type="invalid">Click</MyButton>' },
    { code: '<FormField method="put" />' },
    { code: '<CustomImg loading="invalid" />' },
    { code: '<my-input type="invalid-type" />' },
    { code: '<custom-button type="invalid">Click</custom-button>' },
  ],
  invalid: [],
});
