import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/no-restricted-tags.js";

const ruleTester = createRuleTester();

ruleTester.run("no-restricted-tags", rule, {
  valid: [
    {
      code: "<div></div>",
      options: [{ tagPatterns: ["span"] }],
    },
    {
      code: "<p>content</p>",
      options: [{ tagPatterns: ["div"] }],
    },
  ],
  invalid: [
    {
      code: "<div> </div>",
      options: [{ tagPatterns: ["div"] }],
      errors: [
        {
          messageId: "restricted",
          data: { tag: "div" },
        },
      ],
    },
    {
      code: "<span>text</span>",
      options: [{ tagPatterns: ["span"] }],
      errors: [
        {
          messageId: "restricted",
          data: { tag: "span" },
        },
      ],
    },
    // regex patterns
    {
      code: '<div data-test="value"> </div>',
      options: [{ tagPatterns: ["^div$"] }],
      errors: [
        {
          messageId: "restricted",
          data: { tag: "div" },
        },
      ],
    },
    // custom elements (dashed tag names)
    {
      code: "<custom-element></custom-element>",
      options: [{ tagPatterns: [".*-.*"] }],
      errors: [
        {
          messageId: "restricted",
          data: { tag: "custom-element" },
        },
      ],
    },
    // custom message
    {
      code: "<div> </div>",
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
    // multiple patterns
    {
      code: "<div></div> <span></span>",
      options: [
        {
          tagPatterns: ["div"],
        },
        {
          tagPatterns: ["span"],
          message: "Use a semantic element instead of span",
        },
      ],
      errors: [
        {
          messageId: "restricted",
          data: { tag: "div" },
        },
        {
          message: "Use a semantic element instead of span",
        },
      ],
    },
  ],
});
