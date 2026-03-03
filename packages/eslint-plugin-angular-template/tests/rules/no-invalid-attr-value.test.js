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
    { code: '<form method="dialog"></form>' },
    { code: '<a href="#" target="_blank">Link</a>' },
    { code: '<a href="#" target="_self">Link</a>' },
    { code: '<img src="image.jpg" crossorigin="anonymous" />' },
    { code: '<img src="image.jpg" crossorigin="use-credentials" />' },
    { code: '<img src="image.jpg" loading="lazy" />' },
    { code: '<img src="image.jpg" loading="eager" />' },
    { code: '<div dir="ltr">Text</div>' },
    { code: '<div dir="rtl">Text</div>' },
    { code: '<div dir="auto">Text</div>' },
    { code: '<th scope="row">Header</th>' },
    { code: '<th scope="col">Header</th>' },
    { code: '<th scope="rowgroup">Header</th>' },
    { code: '<th scope="colgroup">Header</th>' },
    { code: '<input type="text" autocomplete="name" />' },
    { code: '<input type="email" autocomplete="email" />' },
    { code: '<input type="password" autocomplete="current-password" />' },
    { code: '<form enctype="application/x-www-form-urlencoded"></form>' },
    { code: '<form enctype="multipart/form-data"></form>' },
    { code: '<form enctype="text/plain"></form>' },
    { code: '<img src="image.jpg" width="100" />' },
    { code: '<img src="image.jpg" height="200" />' },
    { code: '<img src="image.jpg" width="100" height="200" />' },
    { code: '<link rel="stylesheet" href="style.css" />' },
    { code: '<a href="page.html" rel="noopener">Link</a>' },
    { code: '<style blocking="render"></style>' },
    // Angular property bindings - should be skipped
    { code: '<input [type]="inputType" />' },
    { code: '<button [type]="type">Click</button>' },
    { code: '<img [loading]="loading" />' },
    { code: '<div [dir]="direction">Text</div>' },
    // Angular control flow
    { code: '@if (show) { <input type="text" /> }' },
    {
      code: '@for (item of items; track item.id) { <button type="button">Click</button> }',
    },
    // Custom elements are ignored
    { code: '<custom-input type="invalid" />' },
    { code: '<my-button type="invalid">Click</my-button>' },
    // allow option tests
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
      code: '<form method="put"></form>',
      options: [{ allow: [{ tag: "form", attr: "method" }] }],
    },
    {
      code: '<input type="custom-foo" />',
      options: [
        {
          allow: [{ tag: "input", attr: "type", valuePattern: "^custom-.*$" }],
        },
      ],
    },
  ],
  invalid: [
    {
      code: '<input type="invalid-type" />',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 14,
        },
      ],
    },
    {
      code: '<input type="txt" />',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 14,
        },
      ],
    },
    {
      code: '<button type="invalid">Click</button>',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 15,
        },
      ],
    },
    {
      code: '<form method="put"></form>',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 15,
        },
      ],
    },
    {
      code: '<img src="image.jpg" crossorigin="invalid" />',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 35,
        },
      ],
    },
    {
      code: '<img src="image.jpg" loading="invalid" />',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 31,
        },
      ],
    },
    {
      code: '<div dir="invalid">Text</div>',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: '<th scope="invalid">Header</th>',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 12,
        },
      ],
    },
    {
      code: '<input type="text" autocomplete="invalid-value" />',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 34,
        },
      ],
    },
    {
      code: '<form enctype="invalid"></form>',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 16,
        },
      ],
    },
    {
      code: '<img src="image.jpg" width="abc" />',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 29,
        },
      ],
    },
    {
      code: '<img src="image.jpg" width="-100" />',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 29,
        },
      ],
    },
    {
      code: '<img src="image.jpg" width="100px" />',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 29,
        },
      ],
    },
    // Angular control flow with invalid values
    {
      code: '@if (show) { <input type="invalid" /> }',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 27,
        },
      ],
    },
    {
      code: '@for (item of items; track item.id) { <button type="invalid">Click</button> }',
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 53,
        },
      ],
    },
    // allow option tests - should still fail if value doesn't match pattern
    {
      code: '<input type="invalid-type" />',
      options: [
        {
          allow: [
            { tag: "input", attr: "type", valuePattern: "^custom-type$" },
          ],
        },
      ],
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 14,
        },
      ],
    },
    {
      code: '<button type="invalid">Click</button>',
      options: [
        { allow: [{ tag: "button", attr: "type", valuePattern: "^custom$" }] },
      ],
      errors: [
        {
          messageId: "invalid",
          line: 1,
          column: 15,
        },
      ],
    },
  ],
});
