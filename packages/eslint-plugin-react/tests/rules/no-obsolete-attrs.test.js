const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-obsolete-attrs");

const ruleTester = createRuleTester();

ruleTester.run("no-obsolete-attrs", rule, {
  valid: [
    {
      code: '<a href="/page">Link</a>',
    },
    {
      code: '<img src="image.jpg" alt="Image" />',
    },
    {
      code: '<table><tr><th scope="col">Header</th></tr></table>',
    },
    {
      code: '<link rel="stylesheet" href="style.css" />',
    },
    {
      code: '<script src="script.js"></script>',
    },
    {
      code: '<div id="content">Content</div>',
    },
  ],
  invalid: [
    {
      code: '<a charset="UTF-8">Link</a>',
      errors: [
        {
          messageId: "obsolete",
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
      code: '<link charset="UTF-8" />',
      errors: [
        {
          messageId: "obsolete",
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
      code: '<script charset="UTF-8"></script>',
      errors: [
        {
          messageId: "obsolete",
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
      code: '<a name="anchor">Link</a>',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "name",
            element: "a",
            suggestion: "Use the id attribute instead.",
          },
        },
      ],
    },
    {
      code: '<img name="myimage" src="image.jpg" />',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "name",
            element: "img",
            suggestion: "Use the id attribute instead.",
          },
        },
      ],
    },
    {
      code: '<table align="center"></table>',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "align",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: '<div align="left">Content</div>',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "align",
            element: "div",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: '<body bgcolor="#ffffff"></body>',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "bgcolor",
            element: "body",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: '<table bgcolor="#cccccc" border="1"></table>',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "bgcolor",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
        {
          messageId: "obsolete",
          data: {
            attr: "border",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: '<img src="image.jpg" border="0" />',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "border",
            element: "img",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: '<table width="100%" height="200" cellPadding="5" cellSpacing="0"></table>',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "width",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
        {
          messageId: "obsolete",
          data: {
            attr: "height",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
        {
          messageId: "obsolete",
          data: {
            attr: "cellpadding",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
        {
          messageId: "obsolete",
          data: {
            attr: "cellspacing",
            element: "table",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: '<iframe frameBorder="0" scrolling="no"></iframe>',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "frameborder",
            element: "iframe",
            suggestion: "Use CSS instead.",
          },
        },
        {
          messageId: "obsolete",
          data: {
            attr: "scrolling",
            element: "iframe",
            suggestion: "Use CSS instead.",
          },
        },
      ],
    },
    {
      code: '<td scope="row">Cell</td>',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "scope",
            element: "td",
            suggestion: "Use th elements for heading cells.",
          },
        },
      ],
    },
    {
      code: '<html manifest="app.appcache"></html>',
      errors: [
        {
          messageId: "obsolete",
          data: {
            attr: "manifest",
            element: "html",
            suggestion: "Use service workers instead.",
          },
        },
      ],
    },
    {
      code: '<form accept="image/*"></form>',
      errors: [
        {
          messageId: "obsolete",
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
      code: '<div contextMenu="mymenu">Content</div>',
      errors: [
        {
          messageId: "obsolete",
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
