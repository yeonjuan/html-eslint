const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-empty-headings");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-empty-headings", rule, {
  valid: [
    { code: "<h1>Heading Content</h1>" },
    { code: "<h2><span>Text</span></h2>" },
    { code: '<div role="heading" aria-level="1">Heading Content</div>' },
    { code: '<h3 aria-hidden="true">Heading Content</h3>' },
    { code: "<h4 hidden>Heading Content</h4>" },
    { code: '<h2><span aria-hidden="true"></span>Visible</h2>' },
    {
      code: '<h2><span aria-hidden="true">Hidden</span><span>Visible</span></h2>',
    },
  ],
  invalid: [
    {
      code: "<h1></h1>",
      errors: [{ messageId: "emptyHeading" }],
    },
    {
      code: "<h1> <span></span> </h1>",
      errors: [{ messageId: "emptyHeading" }],
    },
    {
      code: "<h1><!-- comment --></h1>",
      errors: [{ messageId: "emptyHeading" }],
    },
    {
      code: '<div role="heading" aria-level="1"></div>',
      errors: [{ messageId: "emptyHeading" }],
    },
    {
      code: '<h2><span aria-hidden="true">Inaccessible text</span></h2>',
      errors: [{ messageId: "inaccessibleHeading" }],
    },
    {
      code: "<h3>   </h3>",
      errors: [{ messageId: "emptyHeading" }],
    },
    {
      code: '<h4><span aria-hidden="true"></span></h4>',
      errors: [{ messageId: "emptyHeading" }],
    },
    {
      code: `<h4>
</h4>`,
      errors: [{ messageId: "emptyHeading" }],
    },
  ],
});

templateRuleTester.run("[template] no-empty-headings", rule, {
  valid: [
    { code: "html`<h1>Heading Content</h1>`" },
    { code: "html`<h1>${foo}</h1>`" },
    { code: "html`<h2><span>Text</span></h2>`" },
    { code: 'html`<div role="heading" aria-level="1">Heading Content</div>`' },
    { code: 'html`<h3 aria-hidden="true">Heading Content</h3>`' },
    { code: "html`<h4 hidden>Heading Content</h4>`" },
    { code: 'html`<h2><span aria-hidden="true"></span>Visible</h2>`' },
    {
      code: 'html`<h2><span aria-hidden="true">Hidden</span><span>Visible</span></h2>`',
    },
  ],
  invalid: [
    {
      code: "html`<h1></h1>`",
      errors: [{ messageId: "emptyHeading" }],
    },
    {
      code: 'html`<div role="heading" aria-level="1"></div>`',
      errors: [{ messageId: "emptyHeading" }],
    },
    {
      code: 'html`<h2><span aria-hidden="true">Inaccessible text</span></h2>`',
      errors: [{ messageId: "inaccessibleHeading" }],
    },
    {
      code: "html`<h3>   </h3>`",
      errors: [{ messageId: "emptyHeading" }],
    },
    {
      code: 'html`<h4><span aria-hidden="true"></span></h4>`',
      errors: [{ messageId: "emptyHeading" }],
    },
  ],
});
