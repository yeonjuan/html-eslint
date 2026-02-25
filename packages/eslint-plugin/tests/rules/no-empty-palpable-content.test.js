const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-empty-palpable-content");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-empty-palpable-content", rule, {
  valid: [
    // Elements with text content are fine
    { code: "<p>Some text</p>" },
    { code: "<div>Content</div>" },
    { code: "<span>Text</span>" },
    { code: "<a href='/'>Link text</a>" },
    { code: "<button>Click me</button>" },
    { code: "<li>List item</li>" },
    { code: "<section><p>Content</p></section>" },
    { code: "<article><h2>Heading</h2><p>Text</p></article>" },
    // Nested text content counts
    { code: "<p><span>Nested text</span></p>" },
    { code: "<div><em>Emphasized</em></div>" },
    { code: "<p>Mixed <strong>bold</strong> content</p>" },
    // Deeply nested text still counts
    { code: "<div><span><em>Deep text</em></span></div>" },
    // Headings are excluded (covered by no-empty-headings)
    { code: "<h1></h1>" },
    { code: "<h2></h2>" },
    { code: "<h3></h3>" },
    // Void / replaced elements not in the check list are ignored
    { code: "<img src='logo.svg' alt='' />" },
    { code: "<input type='text' />" },
    { code: "<br />" },
    { code: "<hr />" },
    // Non-palpable-content elements not in the default list are ignored
    { code: "<table></table>" },
    { code: "<thead></thead>" },
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
    // Whitespace with non-empty nested tag counts as having text
    { code: "<label>  <span>Name</span>  </label>" },
    // aria-label / aria-labelledby provide an accessible name — skip
    { code: "<button aria-label='Close'></button>" },
    { code: "<a href='/' aria-label='Home'></a>" },
    { code: "<div aria-labelledby='heading-id'></div>" },
    // aria-hidden removes element from AT — skip
    { code: "<div aria-hidden='true'></div>" },
    { code: "<span aria-hidden='true'></span>" },
    // role=presentation / role=none — decorative, skip
    { code: "<div role='presentation'></div>" },
    { code: "<span role='none'></span>" },
    // Replaced elements count as content
    { code: "<a href='/'><img alt='GitHub' src='logo.svg' /></a>" },
    { code: "<button><svg viewBox='0 0 24 24'></svg></button>" },
    { code: "<div><img src='icon.png' alt='icon' /></div>" },
    { code: "<figure><canvas></canvas></figure>" },
    { code: "<p><picture><source srcset='img.webp' /><img alt='' src='img.jpg' /></picture></p>" },
  ],
  invalid: [
    // Block elements
    {
      code: "<p></p>",
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    {
      code: "<div></div>",
      errors: [{ messageId: "empty", data: { tag: "div" } }],
    },
    {
      code: "<section></section>",
      errors: [{ messageId: "empty", data: { tag: "section" } }],
    },
    {
      code: "<article></article>",
      errors: [{ messageId: "empty", data: { tag: "article" } }],
    },
    {
      code: "<aside></aside>",
      errors: [{ messageId: "empty", data: { tag: "aside" } }],
    },
    {
      code: "<main></main>",
      errors: [{ messageId: "empty", data: { tag: "main" } }],
    },
    {
      code: "<nav></nav>",
      errors: [{ messageId: "empty", data: { tag: "nav" } }],
    },
    {
      code: "<header></header>",
      errors: [{ messageId: "empty", data: { tag: "header" } }],
    },
    {
      code: "<footer></footer>",
      errors: [{ messageId: "empty", data: { tag: "footer" } }],
    },
    {
      code: "<blockquote></blockquote>",
      errors: [{ messageId: "empty", data: { tag: "blockquote" } }],
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
      code: "<span></span>",
      errors: [{ messageId: "empty", data: { tag: "span" } }],
    },
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
    // Whitespace only
    {
      code: "<p>   </p>",
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    {
      code: "<span>  \n  </span>",
      errors: [{ messageId: "empty", data: { tag: "span" } }],
    },
    // Comment only (no text)
    {
      code: "<p><!-- spacing hack --></p>",
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    // Nested empty tags (no text anywhere in subtree)
    {
      code: "<div><span></span></div>",
      errors: [
        { messageId: "empty", data: { tag: "div" } },
        { messageId: "empty", data: { tag: "span" } },
      ],
    },
    {
      code: "<p><span></span></p>",
      errors: [
        { messageId: "empty", data: { tag: "p" } },
        { messageId: "empty", data: { tag: "span" } },
      ],
    },
    // Multiple errors in one snippet
    {
      code: "<p></p><p></p>",
      errors: [
        { messageId: "empty", data: { tag: "p" } },
        { messageId: "empty", data: { tag: "p" } },
      ],
    },
    // Custom checkElements option
    {
      code: "<p></p>",
      options: [{ checkElements: ["p", "span"] }],
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    {
      code: "<span></span>",
      options: [{ checkElements: ["p", "span"] }],
      errors: [{ messageId: "empty", data: { tag: "span" } }],
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
    {
      code: "html`<p>Content</p>`",
    },
  ],
  invalid: [
    {
      code: "html`<p></p>`",
      errors: [{ messageId: "empty", data: { tag: "p" } }],
    },
    {
      code: "html`<span></span>`",
      errors: [{ messageId: "empty", data: { tag: "span" } }],
    },
  ],
});
