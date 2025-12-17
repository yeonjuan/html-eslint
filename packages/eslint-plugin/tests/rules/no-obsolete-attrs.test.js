const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-obsolete-attrs");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-obsolete-attrs", rule, {
  valid: [
    {
      code: `
<html>
<body>
<a href="/page">Link</a>
<img src="image.jpg" alt="Image">
<table>
  <tr>
    <th scope="col">Header</th>
  </tr>
</table>
</body>
</html>
`,
    },
    {
      code: `<link rel="stylesheet" href="style.css">`,
    },
    {
      code: `<script src="script.js"></script>`,
    },
    {
      code: `<div id="content">Content</div>`,
    },
  ],
  invalid: [
    {
      code: `<a charset="UTF-8">Link</a>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "charset",
            element: "a",
            suggestion:
              "Use an HTTP `Content-Type` header on the linked resource instead.",
          },
        },
      ],
    },
    {
      code: `<link charset="UTF-8">`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "charset",
            element: "link",
            suggestion:
              "Use an HTTP `Content-Type` header on the linked resource instead.",
          },
        },
      ],
    },
    {
      code: `<script charset="UTF-8"></script>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "charset",
            element: "script",
            suggestion:
              "It is redundant to specify it on the script element since it inherits from the document.",
          },
        },
      ],
    },
    {
      code: `<a name="anchor">Link</a>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "name",
            element: "a",
            suggestion: "Use the id attribute instead.",
          },
        },
      ],
    },
    {
      code: `<img name="myimage" src="image.jpg">`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "name",
            element: "img",
            suggestion: "Use the id attribute instead.",
          },
        },
      ],
    },
    {
      code: `<table align="center"></table>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "align",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: `<div align="left">Content</div>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "align",
            element: "div",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: `<body bgcolor="#ffffff"></body>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "bgcolor",
            element: "body",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: `<table bgcolor="#cccccc" border="1"></table>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "bgcolor",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
        {
          messageId: "unexpected",
          data: {
            attr: "border",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: `<img src="image.jpg" border="0">`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "border",
            element: "img",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: `<table width="100%" height="200" cellpadding="5" cellspacing="0"></table>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "width",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
        {
          messageId: "unexpected",
          data: {
            attr: "height",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
        {
          messageId: "unexpected",
          data: {
            attr: "cellpadding",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
        {
          messageId: "unexpected",
          data: {
            attr: "cellspacing",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: `<iframe frameborder="0" scrolling="no"></iframe>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "frameborder",
            element: "iframe",
            suggestion: "Use CSS instead.",
          },
        },
        {
          messageId: "unexpected",
          data: {
            attr: "scrolling",
            element: "iframe",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: `<td scope="row">Cell</td>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "scope",
            element: "td",
            suggestion: "Use th elements for heading cells.",
          },
        },
      ],
    },
    {
      code: `<html manifest="app.appcache"></html>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "manifest",
            element: "html",
            suggestion: "Use service workers instead.",
          },
        },
      ],
    },
    {
      code: `<form accept="image/*"></form>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "accept",
            element: "form",
            suggestion:
              "Use the accept attribute directly on the input elements instead.",
          },
        },
      ],
    },
    {
      code: `<div contextmenu="mymenu">Content</div>`,
      errors: [
        {
          messageId: "unexpected",
          data: {
            attr: "contextmenu",
            element: "div",
            suggestion:
              "To implement a custom context menu, use script to handle the contextmenu event.",
          },
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-obsolete-attrs", rule, {
  valid: [
    {
      code: `html\`<a href="/page">Link</a>\`;`,
    },
    {
      code: `html\`<img src="image.jpg" alt="Image">\`;`,
    },
  ],
  invalid: [
    {
      code: `html\`<a name="anchor">Link</a>\`;`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
    {
      code: `html\`<table align="center"></table>\`;`,
      errors: [
        {
          messageId: "unexpected",
        },
      ],
    },
  ],
});
