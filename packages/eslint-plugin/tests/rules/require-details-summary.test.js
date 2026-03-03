const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-details-summary");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("require-details-summary", rule, {
  valid: [
    // <summary> is the first child element — standard usage
    {
      code: "<details><summary>Show more</summary><p>Hidden content</p></details>",
    },
    // Whitespace text nodes before <summary> are fine
    {
      code: `<details>
  <summary>Toggle</summary>
  <p>Content here</p>
</details>`,
    },
    // <summary> with attributes
    {
      code: "<details><summary class='toggle'>Details</summary>Content</details>",
    },
    // Empty <summary> is still a valid first child (no-empty-headings covers that)
    {
      code: "<details><summary></summary></details>",
    },
    // Nested <details> each with <summary>
    {
      code: `<details>
  <summary>Outer</summary>
  <details>
    <summary>Inner</summary>
    <p>Deep content</p>
  </details>
</details>`,
    },
    // Non-<details> elements are not checked
    { code: "<div><p>No summary needed</p></div>" },
    { code: "<section><h2>Heading</h2></section>" },
  ],

  invalid: [
    // No children at all
    {
      code: "<details></details>",
      errors: [{ messageId: "missingSummary" }],
    },
    // Only text content, no <summary>
    {
      code: "<details>Just text</details>",
      errors: [{ messageId: "missingSummary" }],
    },
    // Element children but no <summary> anywhere
    {
      code: "<details><p>Content without summary</p></details>",
      errors: [{ messageId: "missingSummary" }],
    },
    // <summary> exists but is not the first element child
    {
      code: "<details><p>Content first</p><summary>Late summary</summary></details>",
      errors: [{ messageId: "summaryNotFirst" }],
    },
    // Multiple element children, <summary> buried after others
    {
      code: "<details><div>Wrapper</div><summary>Too late</summary></details>",
      errors: [{ messageId: "summaryNotFirst" }],
    },
    // Inner <details> missing its own <summary>
    {
      code: `<details>
  <summary>Outer summary</summary>
  <details>
    <p>No inner summary</p>
  </details>
</details>`,
      errors: [{ messageId: "missingSummary" }],
    },
  ],
});

templateRuleTester.run("require-details-summary (template)", rule, {
  valid: [
    {
      code: 'const t = html`<details><summary>Info</summary><p>More</p></details>`',
    },
  ],
  invalid: [
    {
      code: 'const t = html`<details><p>Missing summary</p></details>`',
      errors: [{ messageId: "missingSummary" }],
    },
  ],
});
