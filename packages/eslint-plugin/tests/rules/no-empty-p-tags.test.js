const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-empty-p-tags");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-empty-p-tags", rule, {
  valid: [
    { code: "<p>Some text</p>" },
    { code: "<p>  Leading and trailing spaces  </p>" },
    { code: "<p><span>Text inside span</span></p>" },
    { code: "<p><strong>Bold text</strong></p>" },
    { code: "<p><a href='/'>Link text</a></p>" },
    { code: "<p>Mixed <em>emphasis</em> content</p>" },
    { code: "<p><!-- comment -->Visible text</p>" },
    {
      code: "<p><span><em>Deeply nested text</em></span></p>",
    },
  ],
  invalid: [
    {
      code: "<p></p>",
      errors: [{ messageId: "emptyP" }],
    },
    {
      code: "<p>   </p>",
      errors: [{ messageId: "emptyP" }],
    },
    {
      code: "<p><!-- comment --></p>",
      errors: [{ messageId: "emptyP" }],
    },
    {
      code: "<p><span></span></p>",
      errors: [{ messageId: "emptyP" }],
    },
    {
      code: `<p>
</p>`,
      errors: [{ messageId: "emptyP" }],
    },
    {
      code: "<p><span>  </span></p>",
      errors: [{ messageId: "emptyP" }],
    },
  ],
});

templateRuleTester.run("[template] no-empty-p-tags", rule, {
  valid: [
    { code: "html`<p>Some text</p>`" },
    { code: "html`<p>${content}</p>`" },
    { code: "html`<p><span>Text</span></p>`" },
  ],
  invalid: [
    {
      code: "html`<p></p>`",
      errors: [{ messageId: "emptyP" }],
    },
    {
      code: "html`<p>   </p>`",
      errors: [{ messageId: "emptyP" }],
    },
    {
      code: "html`<p><span></span></p>`",
      errors: [{ messageId: "emptyP" }],
    },
  ],
});
