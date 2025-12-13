const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-whitespace-only-children");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-whitespace-only-children", rule, {
  valid: [
    // No children
    {
      code: "<div></div>",
    },
    // Has text content
    {
      code: "<div>Hello</div>",
    },
    // Has child element
    {
      code: "<div><span></span></div>",
    },
    // Whitespace with text
    {
      code: "<div>\n  Hello\n</div>",
    },
    // With tagPatterns option - non-matching tag
    {
      code: "<div>  \n  </div>",
      options: [{ tagPatterns: ["^span$"] }],
    },
    // With tagPatterns option - tag has content
    {
      code: "<span>content</span>",
      options: [{ tagPatterns: ["^span$"] }],
    },
    // Allow comment only
    {
      code: "<custom-component><!-- comment --></custom-component>",
      options: [{ tagPatterns: ["^custom-component$"] }],
    },
  ],
  invalid: [
    // Only whitespace (spaces)
    {
      code: "<div>   </div>",
      output: "<div></div>",
      errors: [
        {
          messageId: "whitespaceOnlyChildren",
        },
      ],
    },
    // Only whitespace (newlines)
    {
      code: "<div>\n\n</div>",
      output: "<div></div>",
      errors: [
        {
          messageId: "whitespaceOnlyChildren",
        },
      ],
    },
    // Only whitespace (tabs)
    {
      code: "<div>\t\t</div>",
      output: "<div></div>",
      errors: [
        {
          messageId: "whitespaceOnlyChildren",
        },
      ],
    },
    // Mixed whitespace
    {
      code: "<div>  \n\t  </div>",
      output: "<div></div>",
      errors: [
        {
          messageId: "whitespaceOnlyChildren",
        },
      ],
    },
    // With tagPatterns option - matching tag with whitespace
    {
      code: "<span>  \n  </span>",
      output: "<span></span>",
      options: [{ tagPatterns: ["^span$"] }],
      errors: [
        {
          messageId: "whitespaceOnlyChildren",
        },
      ],
    },
    // With tagPatterns option - multiple patterns
    {
      code: "<div>  </div>",
      output: "<div></div>",
      options: [{ tagPatterns: ["^div$", "^span$"] }],
      errors: [
        {
          messageId: "whitespaceOnlyChildren",
        },
      ],
    },
    // With tagPatterns option - regex pattern
    {
      code: "<button>  \n  </button>",
      output: "<button></button>",
      options: [{ tagPatterns: ["^button$"] }],
      errors: [
        {
          messageId: "whitespaceOnlyChildren",
        },
      ],
    },
    // Allow comment only
    {
      code: "<custom-component> <!-- comment --> </custom-component>",
      output: "<custom-component><!-- comment --></custom-component>",
      options: [{ tagPatterns: ["^custom-component$"] }],
      errors: [
        {
          messageId: "whitespaceOnlyChildren",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-whitespace-only-children", rule, {
  valid: [
    {
      code: "html`<div>Hello</div>`",
    },
    {
      code: "html`<span>${message}</span>`",
      options: [{ tagPatterns: ["^span$"] }],
    },
  ],
  invalid: [
    {
      code: "html`<div>  </div>`",
      output: "html`<div></div>`",
      errors: [
        {
          messageId: "whitespaceOnlyChildren",
        },
      ],
    },
    {
      code: "html`<span>\n</span>`",
      options: [{ tagPatterns: ["^span$"] }],
      output: "html`<span></span>`",
      errors: [
        {
          messageId: "whitespaceOnlyChildren",
        },
      ],
    },
  ],
});
