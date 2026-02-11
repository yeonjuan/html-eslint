const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-invalid-attr-value");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-invalid-attr-value", rule, {
  valid: [
    { code: '<input type="text" />' },
    { code: '<input type="email" />' },
    { code: '<input type="number" />' },
    { code: '<input type="password" />' },
    { code: '<input type="checkbox" />' },
    { code: '<input type="radio" />' },
    { code: '<input type="file" />' },
    { code: '<input type="hidden" />' },
    { code: '<input type="submit" />' },
    { code: '<input type="button" />' },
    { code: '<input type="reset" />' },
    { code: '<input type="date" />' },
    { code: '<input type="time" />' },
    { code: '<input type="url" />' },
    { code: '<input type="tel" />' },
    { code: '<input type="search" />' },
    { code: '<input type="color" />' },
    { code: '<input type="range" />' },
    { code: '<a href="#" target="_blank">Link</a>' },
    { code: '<a href="#" target="_self">Link</a>' },
    { code: '<a href="#" target="_parent">Link</a>' },
    { code: '<a href="#" target="_top">Link</a>' },
    { code: '<img src="image.jpg" crossorigin="anonymous" />' },
    { code: '<img src="image.jpg" crossorigin="use-credentials" />' },
    { code: '<script src="script.js" crossorigin="anonymous"></script>' },
    { code: '<button type="button">Click</button>' },
    { code: '<button type="submit">Submit</button>' },
    { code: '<button type="reset">Reset</button>' },
    { code: '<form method="get"></form>' },
    { code: '<form method="post"></form>' },
    { code: '<form method="dialog"></form>' },
    { code: '<form enctype="application/x-www-form-urlencoded"></form>' },
    { code: '<form enctype="multipart/form-data"></form>' },
    { code: '<form enctype="text/plain"></form>' },
    { code: '<th scope="row">Header</th>' },
    { code: '<th scope="col">Header</th>' },
    { code: '<th scope="rowgroup">Header</th>' },
    { code: '<th scope="colgroup">Header</th>' },
    { code: '<input type="text" autocomplete="name" />' },
    { code: '<input type="email" autocomplete="email" />' },
    { code: '<input type="text" autocomplete="username" />' },
    { code: '<input type="password" autocomplete="current-password" />' },
    { code: '<input type="text" autocomplete="off" />' },
    { code: '<input type="text" autocomplete="on" />' },
    { code: '<link rel="stylesheet" href="style.css" />' },
    { code: '<a href="page.html" rel="noopener">Link</a>' },
    { code: '<a href="page.html" rel="noreferrer">Link</a>' },
    { code: '<a href="page.html" rel="nofollow">Link</a>' },
    { code: '<link rel="icon" href="favicon.ico" />' },
    { code: '<link rel="preload" href="font.woff2" />' },
    { code: '<div dir="ltr">Text</div>' },
    { code: '<div dir="rtl">Text</div>' },
    { code: '<div dir="auto">Text</div>' },
    { code: '<img src="image.jpg" loading="lazy" />' },
    { code: '<img src="image.jpg" loading="eager" />' },
    { code: '<img src="image.jpg" width="100" />' },
    { code: '<img src="image.jpg" height="200" />' },
    { code: '<img src="image.jpg" width="100" height="200" />' },
    { code: '<img src="image.jpg" width="0" height="0" />' },
    { code: '<input type="email" multiple />' },
    { code: '<a href="#" target="_blank" rel="noopener">Link</a>' },
    { code: '<form method="post" enctype="multipart/form-data"></form>' },
    { code: '<input type="text" name="username" autocomplete="username" />' },
    { code: '<img src="image.jpg" crossorigin="anonymous" loading="lazy" />' },
    { code: '<script src="script.js" crossorigin="anonymous" async></script>' },
    { code: '<button type="submit" name="action">Submit</button>' },
    { code: '<input type="date" min="2020-01-01" max="2025-12-31" />' },
    {
      code: '<a href="page.html" target="_blank" rel="noopener noreferrer">Link</a>',
    },
    // ignore option tests - allow any value for specified tag/attr
    {
      code: '<input type="custom-type" />',
      options: [{ ignore: [{ tag: "input", attr: "type" }] }],
    },
    {
      code: '<input type="invalid-type" />',
      options: [{ ignore: [{ tag: "input", attr: "type" }] }],
    },
    {
      code: '<button type="custom">Click</button>',
      options: [{ ignore: [{ tag: "button", attr: "type" }] }],
    },
    {
      code: '<form method="put"></form>',
      options: [{ ignore: [{ tag: "form", attr: "method" }] }],
    },
    // ignore option tests - allow specific values with valuePattern (exact match)
    {
      code: '<input type="custom-type" />',
      options: [
        {
          ignore: [
            { tag: "input", attr: "type", valuePattern: "^custom-type$" },
          ],
        },
      ],
    },
    {
      code: '<button type="custom">Click</button>',
      options: [
        { ignore: [{ tag: "button", attr: "type", valuePattern: "^custom$" }] },
      ],
    },
    {
      code: '<form method="put"></form>',
      options: [
        { ignore: [{ tag: "form", attr: "method", valuePattern: "^put$" }] },
      ],
    },
    // ignore option tests - allow multiple values with regex pattern
    {
      code: '<input type="custom-type" />',
      options: [
        {
          ignore: [
            {
              tag: "input",
              attr: "type",
              valuePattern: "^(custom-type|another-type)$",
            },
          ],
        },
      ],
    },
    {
      code: '<input type="another-type" />',
      options: [
        {
          ignore: [
            {
              tag: "input",
              attr: "type",
              valuePattern: "^(custom-type|another-type)$",
            },
          ],
        },
      ],
    },
    // ignore option tests - pattern matching with wildcards
    {
      code: '<input type="custom-foo" />',
      options: [
        {
          ignore: [{ tag: "input", attr: "type", valuePattern: "^custom-.*$" }],
        },
      ],
    },
    {
      code: '<input type="custom-bar" />',
      options: [
        {
          ignore: [{ tag: "input", attr: "type", valuePattern: "^custom-.*$" }],
        },
      ],
    },
    // multiple ignore rules
    {
      code: '<input type="custom-type" /><button type="custom">Click</button>',
      options: [
        {
          ignore: [
            { tag: "input", attr: "type" },
            { tag: "button", attr: "type", valuePattern: "^custom$" },
          ],
        },
      ],
    },
    // case insensitive matching
    {
      code: '<INPUT TYPE="custom-type" />',
      options: [{ ignore: [{ tag: "input", attr: "type" }] }],
    },
    {
      code: '<Input Type="custom-type" />',
      options: [{ ignore: [{ tag: "INPUT", attr: "TYPE" }] }],
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
      code: '<img src="image.jpg" crossorigin="invalid" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<script src="script.js" crossorigin="yes"></script>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<button type="invalid">Click</button>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<button type="link">Click</button>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<form method="invalid"></form>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<form method="put"></form>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<form enctype="invalid"></form>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<form enctype="application/json"></form>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<th scope="invalid">Header</th>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<th scope="column">Header</th>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<input type="text" autocomplete="invalid-value" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<div dir="invalid">Text</div>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<div dir="left">Text</div>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<img src="image.jpg" loading="invalid" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<img src="image.jpg" loading="fast" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<img src="image.jpg" width="abc" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<img src="image.jpg" height="xyz" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<img src="image.jpg" width="-100" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<img src="image.jpg" width="100px" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<form method="get" enctype="invalid"></form>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<button type="invalid" name="action">Click</button>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<img src="image.jpg" crossorigin="invalid" loading="lazy" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<img src="image.jpg" crossorigin="anonymous" loading="invalid" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<script src="script.js" crossorigin="invalid" async></script>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<form method="invalid" enctype="multipart/form-data"></form>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<form method="post" enctype="invalid"></form>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<input type="invalid" autocomplete="name" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<input type="text" autocomplete="invalid" name="field" />',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<div dir="invalid" id="content">Text</div>',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<th scope="invalid" id="header">Header</th>',
      errors: [{ messageId: "invalid" }],
    },
    // ignore option tests - should still fail if value doesn't match pattern
    {
      code: '<input type="invalid-type" />',
      options: [
        {
          ignore: [
            { tag: "input", attr: "type", valuePattern: "^custom-type$" },
          ],
        },
      ],
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<button type="invalid">Click</button>',
      options: [
        { ignore: [{ tag: "button", attr: "type", valuePattern: "^custom$" }] },
      ],
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<form method="put"></form>',
      options: [
        { ignore: [{ tag: "form", attr: "method", valuePattern: "^delete$" }] },
      ],
      errors: [{ messageId: "invalid" }],
    },
    // ignore option tests - should fail with pattern that doesn't match
    {
      code: '<input type="invalid-type" />',
      options: [
        {
          ignore: [{ tag: "input", attr: "type", valuePattern: "^custom-.*$" }],
        },
      ],
      errors: [{ messageId: "invalid" }],
    },
    // ignore option tests - should fail if tag or attr doesn't match
    {
      code: '<input type="invalid-type" />',
      options: [{ ignore: [{ tag: "button", attr: "type" }] }],
      errors: [{ messageId: "invalid" }],
    },
    {
      code: '<button type="invalid">Click</button>',
      options: [{ ignore: [{ tag: "button", attr: "name" }] }],
      errors: [{ messageId: "invalid" }],
    },
  ],
});

templateRuleTester.run("[template] no-invalid-attr-value", rule, {
  valid: [
    { code: 'html`<input type="${inputType}" />`' },
    { code: 'html`<input type="text" name="${name}" />`' },
    { code: 'html`<button type="${type}">Click</button>`' },
    { code: 'html`<form method="${method}"></form>`' },
    { code: 'html`<form enctype="${enctype}"></form>`' },
    { code: 'html`<img src="image.jpg" crossorigin="${cors}" />`' },
    { code: 'html`<img src="image.jpg" loading="${loading}" />`' },
    { code: 'html`<img src="image.jpg" width="${width}" />`' },
    { code: 'html`<img src="image.jpg" height="${height}" />`' },
    { code: 'html`<img src="image.jpg" width="100" height="200" />`' },
    { code: 'html`<div dir="${direction}">Text</div>`' },
    { code: 'html`<th scope="${scope}">Header</th>`' },
    { code: 'html`<input type="text" autocomplete="${autocomplete}" />`' },
    { code: 'html`<link rel="${rel}" href="style.css" />`' },
    { code: 'html`<script src="script.js" crossorigin="${cors}"></script>`' },
    {
      code: 'html`<input type="${type}" autocomplete="${autocomplete}" />`',
    },
    {
      code: 'html`<form method="${method}" enctype="${enctype}"></form>`',
    },
    {
      code: 'html`<img src="image.jpg" crossorigin="${cors}" loading="${loading}" />`',
    },
    {
      code: 'html`<a href="${url}" target="${target}" rel="${rel}">Link</a>`',
    },
    { code: 'html`<input type="text" name="${name}" value="${value}" />`' },
    { code: 'html`<button type="submit" id="${id}">Submit</button>`' },
    // ignore option tests with templates
    {
      code: 'html`<input type="custom-type" />`',
      options: [{ ignore: [{ tag: "input", attr: "type" }] }],
    },
    {
      code: 'html`<button type="custom">Click</button>`',
      options: [
        { ignore: [{ tag: "button", attr: "type", valuePattern: "^custom$" }] },
      ],
    },
    {
      code: 'html`<input type="custom-foo" />`',
      options: [
        {
          ignore: [{ tag: "input", attr: "type", valuePattern: "^custom-.*$" }],
        },
      ],
    },
  ],
  invalid: [
    {
      code: 'html`<input type="invalid" />`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<input type="txt" name="${name}" />`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<button type="invalid" id="${id}">Click</button>`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<form method="invalid"></form>`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<form method="put" action="${action}"></form>`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<form enctype="invalid"></form>`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<img src="image.jpg" crossorigin="invalid" />`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<img src="${src}" loading="invalid" />`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<img src="image.jpg" width="abc" />`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<img src="image.jpg" height="-100" />`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<img src="image.jpg" width="100px" />`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<div dir="invalid">Text</div>`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<div dir="left" id="${id}">Text</div>`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<th scope="invalid">Header</th>`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<th scope="column" id="${id}">Header</th>`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<input type="text" autocomplete="invalid-value" />`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<script src="script.js" crossorigin="yes"></script>`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<input type="invalid" autocomplete="${autocomplete}" />`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<form method="invalid" enctype="${enctype}"></form>`',
      errors: [{ messageId: "invalid" }],
    },
    {
      code: 'html`<img src="image.jpg" crossorigin="invalid" loading="${loading}" />`',
      errors: [{ messageId: "invalid" }],
    },
    // ignore option tests with templates - should still fail if not ignored
    {
      code: 'html`<input type="invalid-type" />`',
      options: [{ ignore: [{ tag: "button", attr: "type" }] }],
      errors: [{ messageId: "invalid" }],
    },
  ],
});
