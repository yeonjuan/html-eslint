const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-empty-palpable-content");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-empty-palpable-content", rule, {
  valid: [
    // Elements with text content are fine
    { code: "<p>Some text</p>" },
    { code: "<a href='/'>Link text</a>" },
    { code: "<button>Click me</button>" },
    { code: "<li>List item</li>" },
    { code: "<section><p>Content</p></section>" },
    { code: "<article><h2>Heading</h2><p>Text</p></article>" },
    // Nested text content counts
    { code: "<p><span>Nested text</span></p>" },
    { code: "<p>Mixed <strong>bold</strong> content</p>" },
    // Elements not in the default set are not checked
    { code: "<div></div>" },
    { code: "<span></span>" },
    { code: "<section></section>" },
    { code: "<article></article>" },
    { code: "<aside></aside>" },
    { code: "<main></main>" },
    { code: "<nav></nav>" },
    { code: "<header></header>" },
    { code: "<footer></footer>" },
    { code: "<pre></pre>" },
    { code: "<figure></figure>" },
    // Headings are excluded (covered by no-empty-headings)
    { code: "<h1></h1>" },
    { code: "<h2></h2>" },
    // Void / replaced elements not in the check list are ignored
    { code: "<img src='logo.svg' alt='' />" },
    { code: "<input type='text' />" },
    { code: "<table></table>" },
    { code: "<tr></tr>" },
    // Custom checkElements option — only specified elements are checked
    {
      code: "<div></div>",
      options: [{ checkElements: ["p"] }],
    },
    {
      code: "<p>Text</p>",
      options: [{ checkElements: ["p", "span"] }],
    },
    // aria-label / aria-labelledby provide an accessible name — skip
    { code: "<button aria-label='Close'></button>" },
    { code: "<a href='/' aria-label='Home'></a>" },
    { code: "<label aria-label='Email'></label>" },
    { code: "<div aria-labelledby='heading-id'></div>" },
    // aria-hidden removes element from AT — skip
    { code: "<p aria-hidden='true'></p>" },
    { code: "<em aria-hidden='true'></em>" },
    // role=presentation / role=none — decorative, skip
    { code: "<a role='presentation'></a>" },
    { code: "<button role='none'></button>" },
    // Replaced elements count as content
    { code: "<a href='/'><img alt='GitHub' src='logo.svg' /></a>" },
    { code: "<button><svg viewBox='0 0 24 24'></svg></button>" },
    {
      code: "<p><picture><source srcset='img.webp' /><img alt='' src='img.jpg' /></picture></p>",
    },
    // Non-standard / template elements count as content
    { code: "<label><content></content></label>" },
    { code: "<p><slot></slot></p>" },
    { code: "<li><my-component></my-component></li>" },
  ],
  invalid: [
    // Block / paragraph elements
    {
      code: "<p></p>",
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    {
      code: "<blockquote></blockquote>",
      errors: [{ messageId: "empty", data: { tag: "blockquote" } }],
    },
    {
      code: "<q></q>",
      errors: [{ messageId: "empty", data: { tag: "q" } }],
    },
    // Interactive elements
    {
      code: "<a href='/'></a>",
      errors: [{ messageId: "empty", data: { tag: "a" } }],
    },
    {
      code: "<button></button>",
      errors: [{ messageId: "empty", data: { tag: "button" } }],
    },
    {
      code: "<label></label>",
      errors: [{ messageId: "empty", data: { tag: "label" } }],
    },
    // Inline elements
    {
      code: "<em></em>",
      errors: [{ messageId: "empty", data: { tag: "em" } }],
    },
    {
      code: "<strong></strong>",
      errors: [{ messageId: "empty", data: { tag: "strong" } }],
    },
    {
      code: "<code></code>",
      errors: [{ messageId: "empty", data: { tag: "code" } }],
    },
    {
      code: "<cite></cite>",
      errors: [{ messageId: "empty", data: { tag: "cite" } }],
    },
    // List items
    {
      code: "<li></li>",
      errors: [{ messageId: "empty", data: { tag: "li" } }],
    },
    {
      code: "<dt></dt>",
      errors: [{ messageId: "empty", data: { tag: "dt" } }],
    },
    {
      code: "<dd></dd>",
      errors: [{ messageId: "empty", data: { tag: "dd" } }],
    },
    {
      code: "<figcaption></figcaption>",
      errors: [{ messageId: "empty", data: { tag: "figcaption" } }],
    },
    // Whitespace / comment only
    {
      code: "<p>   </p>",
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    {
      code: "<p><!-- spacing hack --></p>",
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    // p with nested empty standard element (span not in defaults, but p still flagged)
    {
      code: "<p><span></span></p>",
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    // Multiple errors in one snippet
    {
      code: "<p></p><p></p>",
      errors: [
        { messageId: "empty", data: { tag: "p" } },
        { messageId: "empty", data: { tag: "p" } },
      ],
    },
    // Custom checkElements option opts in elements not in defaults
    {
      code: "<div></div>",
      options: [{ checkElements: ["div"] }],
      errors: [{ messageId: "empty", data: { tag: "div" } }],
    },
    {
      code: "<span></span>",
      options: [{ checkElements: ["span"] }],
      errors: [{ messageId: "empty", data: { tag: "span" } }],
    },
    {
      code: "<section></section>",
      options: [{ checkElements: ["section"] }],
      errors: [{ messageId: "empty", data: { tag: "section" } }],
    },
    // Case-insensitive tag matching
    {
      code: "<P></P>",
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    {
      code: "<BUTTON></BUTTON>",
      errors: [{ messageId: "empty", data: { tag: "button" } }],
    },
  ],
});

// Also runs in template (JS) context
templateRuleTester.run("[template] no-empty-palpable-content", rule, {
  valid: [
    { code: "html`<p>Content</p>`" },
    { code: "html`<button aria-label='close'></button>`" },
  ],
  invalid: [
    {
      code: "html`<p></p>`",
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    {
      code: "html`<button></button>`",
      errors: [{ messageId: "empty", data: { tag: "button" } }],
    },
  ],
});
