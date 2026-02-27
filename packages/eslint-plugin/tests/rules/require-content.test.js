const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-content");

const ruleTester = createRuleTester();

ruleTester.run("require-content", rule, {
  valid: [
    // Elements with text content
    { code: `<p>Hello world</p>` },
    { code: `<a href="/foo">Click here</a>` },
    { code: `<button>Submit</button>` },
    { code: `<h1>Page title</h1>` },
    { code: `<li>Item</li>` },
    { code: `<label>Name</label>` },
    { code: `<option value="1">One</option>` },
    { code: `<dt>Term</dt>` },
    { code: `<dd>Definition</dd>` },

    // Elements with child element content
    { code: `<button><img src="icon.svg" alt="Submit" /></button>` },
    { code: `<p><span>text</span></p>` },
    { code: `<a href="/foo"><strong>link</strong></a>` },
    { code: `<label><input type="checkbox" /> Accept</label>` },

    // ARIA accessible name — visible content is optional
    { code: `<button aria-label="Close"></button>` },
    { code: `<a href="/foo" aria-label="Home"></a>` },
    { code: `<button aria-labelledby="btn-label"></button>` },

    // Hidden elements — do not need content
    { code: `<p hidden></p>` },
    { code: `<button aria-hidden="true"></button>` },
    { code: `<li aria-hidden="true"></li>` },

    // Elements not in the default list are ignored
    { code: `<div></div>` },
    { code: `<span></span>` },
    { code: `<section></section>` },

    // Custom elements list — only check configured elements (p is ignored since not in custom list)
    {
      code: `<p></p><span>content</span>`,
      options: [{ elements: ["span"] }],
    },
    {
      code: `<span>content</span>`,
      options: [{ elements: ["span"] }],
    },

    // Whitespace-only child text followed by a real child element
    { code: `<button>  <span>OK</span>  </button>` },
  ],

  invalid: [
    // Completely empty elements
    {
      code: `<p></p>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<a href="/foo"></a>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<button></button>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<h1></h1>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<h2></h2>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<h3></h3>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<li></li>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<label></label>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<option value="1"></option>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<dt></dt>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<dd></dd>`,
      errors: [{ messageId: "requireContent" }],
    },

    // Whitespace-only text (no meaningful content)
    {
      code: `<p>   </p>`,
      errors: [{ messageId: "requireContent" }],
    },
    {
      code: `<button>
      </button>`,
      errors: [{ messageId: "requireContent" }],
    },

    // aria-hidden child only — no visible content and hidden children don't count
    {
      code: `<p><span aria-hidden="true">hidden</span></p>`,
      errors: [{ messageId: "requireContent" }],
    },

    // Custom elements list
    {
      code: `<span></span>`,
      options: [{ elements: ["span"] }],
      errors: [{ messageId: "requireContent" }],
    },

    // Multiple violations
    {
      code: `<p></p><button></button>`,
      errors: [
        { messageId: "requireContent" },
        { messageId: "requireContent" },
      ],
    },
  ],
});
