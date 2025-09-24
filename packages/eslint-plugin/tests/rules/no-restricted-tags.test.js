const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-restricted-tags");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-restricted-tags", rule, {
  valid: [
    {
      code: `<div> </div>`,
      options: [
        {
          tagPatterns: ["span"],
        },
      ],
    },
    {
      code: `<p>content</p>`,
      options: [
        {
          tagPatterns: ["div"],
        },
      ],
    },
    {
      code: `<article><header></header></article>`,
      options: [
        {
          tagPatterns: ["footer"],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `<div> </div>`,
      options: [
        {
          tagPatterns: ["div"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            tag: "div",
          },
        },
      ],
    },
    {
      code: `<span>text</span>`,
      options: [
        {
          tagPatterns: ["span"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            tag: "span",
          },
        },
      ],
    },
    {
      code: `<script src="test.js"></script>`,
      options: [
        {
          tagPatterns: ["script"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            tag: "script",
          },
        },
      ],
    },
    {
      code: `<style>.test {}</style>`,
      options: [
        {
          tagPatterns: ["style"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            tag: "style",
          },
        },
      ],
    },
    // regex patterns
    {
      code: `<div data-test="value"> </div> <span></span>`,
      options: [
        {
          tagPatterns: ["^div$"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            tag: "div",
          },
        },
      ],
    },
    {
      code: `<custom-element></custom-element> <another-custom></another-custom>`,
      options: [
        {
          tagPatterns: [".*-.*"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            tag: "custom-element",
          },
        },
        {
          messageId: "restricted",
          data: {
            tag: "another-custom",
          },
        },
      ],
    },
    {
      code: `<h1>Title</h1> <h2>Subtitle</h2> <h3>Section</h3>`,
      options: [
        {
          tagPatterns: ["h[1-6]"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            tag: "h1",
          },
        },
        {
          messageId: "restricted",
          data: {
            tag: "h2",
          },
        },
        {
          messageId: "restricted",
          data: {
            tag: "h3",
          },
        },
      ],
    },
    // custom message
    {
      code: `<div> </div>`,
      options: [
        {
          tagPatterns: ["div"],
          message: "Do not use div tags, use semantic elements instead",
        },
      ],
      errors: [
        {
          message: "Do not use div tags, use semantic elements instead",
        },
      ],
    },
    {
      code: `<font size="3">old style</font>`,
      options: [
        {
          tagPatterns: ["font|center|marquee"],
          message: "Deprecated HTML tags are not allowed",
        },
      ],
      errors: [
        {
          message: "Deprecated HTML tags are not allowed",
        },
      ],
    },
    // multiple patterns
    {
      code: `<div></div> <span></span> <custom-tag></custom-tag>`,
      options: [
        {
          tagPatterns: ["div", "span"],
        },
        {
          tagPatterns: [".*-.*"],
          message: "Custom elements should follow naming conventions",
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            tag: "div",
          },
        },
        {
          messageId: "restricted",
          data: {
            tag: "span",
          },
        },
        {
          message: "Custom elements should follow naming conventions",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] no-restricted-tags", rule, {
  valid: [
    {
      code: `html\`<p>content</p>\``,
      options: [
        {
          tagPatterns: ["div"],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `html\`<div>content</div>\``,
      options: [
        {
          tagPatterns: ["div"],
          message: "Do not use div in templates",
        },
      ],
      errors: [
        {
          message: "Do not use div in templates",
        },
      ],
    },
    {
      code: `html\`<custom-element></custom-element>\``,
      options: [
        {
          tagPatterns: [".*-.*"],
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: {
            tag: "custom-element",
          },
        },
      ],
    },
  ],
});
