const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-redundant-role");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-redundant-role", rule, {
  valid: [
    {
      code: "<div></div>",
    },
    {
      code: '<div role="grid"></div>',
    },
    {
      code: "<button></button>",
    },
    {
      code: '<button role="link"></button>',
    },
    {
      code: "<nav></nav>",
    },
    {
      code: '<nav role="tablist"></nav>',
    },
    {
      code: "<main></main>",
    },
    {
      code: '<a href="/">Link</a>',
    },
    {
      code: "<a>Not a link</a>",
    },
    {
      code: '<input type="text">',
    },
    {
      code: '<input type="text" role="combobox">',
    },
    {
      code: '<img alt="description">',
    },
    {
      code: '<img alt="" role="presentation">',
    },
    {
      code: "<form></form>",
    },
    {
      code: '<form name="myform"></form>',
    },
    {
      code: "<section></section>",
    },
    {
      code: '<section aria-label="My section"></section>',
    },
  ],
  invalid: [
    {
      code: '<button role="button">Click</button>',
      output: '<button >Click</button>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "button",
            element: "button",
          },
        },
      ],
    },
    {
      code: '<nav role="navigation"></nav>',
      output: '<nav ></nav>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "navigation",
            element: "nav",
          },
        },
      ],
    },
    {
      code: '<main role="main"></main>',
      output: '<main ></main>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "main",
            element: "main",
          },
        },
      ],
    },
    {
      code: '<a href="/" role="link">Link</a>',
      output: '<a href="/" >Link</a>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "link",
            element: "a",
          },
        },
      ],
    },
    {
      code: '<ul role="list"></ul>',
      output: '<ul ></ul>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "list",
            element: "ul",
          },
        },
      ],
    },
    {
      code: '<ol role="list"></ol>',
      output: '<ol ></ol>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "list",
            element: "ol",
          },
        },
      ],
    },
    {
      code: '<input type="checkbox" role="checkbox">',
      output: '<input type="checkbox" >',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "checkbox",
            element: "input",
          },
        },
      ],
    },
    {
      code: '<input type="radio" role="radio">',
      output: '<input type="radio" >',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "radio",
            element: "input",
          },
        },
      ],
    },
    {
      code: '<input type="text" role="textbox">',
      output: '<input type="text" >',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "textbox",
            element: "input",
          },
        },
      ],
    },
    {
      code: '<textarea role="textbox"></textarea>',
      output: '<textarea ></textarea>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "textbox",
            element: "textarea",
          },
        },
      ],
    },
    {
      code: '<article role="article"></article>',
      output: '<article ></article>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "article",
            element: "article",
          },
        },
      ],
    },
    {
      code: '<aside role="complementary"></aside>',
      output: '<aside ></aside>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "complementary",
            element: "aside",
          },
        },
      ],
    },
    {
      code: '<h1 role="heading"></h1>',
      output: '<h1 ></h1>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "heading",
            element: "h1",
          },
        },
      ],
    },
    {
      code: '<table role="table"></table>',
      output: '<table ></table>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "table",
            element: "table",
          },
        },
      ],
    },
    {
      code: '<tr role="row"></tr>',
      output: '<tr ></tr>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "row",
            element: "tr",
          },
        },
      ],
    },
    {
      code: '<td role="cell"></td>',
      output: '<td ></td>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "cell",
            element: "td",
          },
        },
      ],
    },
    {
      code: '<form name="myform" role="form"></form>',
      output: '<form name="myform" ></form>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "form",
            element: "form",
          },
        },
      ],
    },
    {
      code: '<progress role="progressbar"></progress>',
      output: '<progress ></progress>',
      errors: [
        {
          messageId: "redundant",
          data: {
            role: "progressbar",
            element: "progress",
          },
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-redundant-role", rule, {
  valid: [
    {
      code: 'html`<div role="grid"></div>`',
    },
    {
      code: `
const role = "grid";
html\`<div role="\${role}"></div>\``,
    },
    {
      code: "html`<button></button>`",
    },
  ],
  invalid: [
    {
      code: 'html`<button role="button">Click</button>`',
      output: 'html`<button >Click</button>`',
      errors: [
        {
          message:
            "Redundant role 'button'. The element <button> already has an implicit role of 'button'.",
        },
      ],
    },
    {
      code: 'html`<nav role="navigation"></nav>`',
      output: 'html`<nav ></nav>`',
      errors: [
        {
          message:
            "Redundant role 'navigation'. The element <nav> already has an implicit role of 'navigation'.",
        },
      ],
    },
    {
      code: 'html`<main role="main"></main>`',
      output: 'html`<main ></main>`',
      errors: [
        {
          message:
            "Redundant role 'main'. The element <main> already has an implicit role of 'main'.",
        },
      ],
    },
  ],
});
