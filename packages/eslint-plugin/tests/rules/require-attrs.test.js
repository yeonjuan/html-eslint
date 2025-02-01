const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-attrs");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("require-attrs", rule, {
  valid: [
    {
      code: `<svg></svg>`,
    },
    {
      code: `<svg viewBox="0 0 100 100"></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
        },
      ],
    },
    {
      code: `<svg viewBox="0 0 100 100"></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "0 0 100 100",
        },
      ],
    },
    {
      code: `<svg viewBox></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
        },
      ],
    },
    {
      code: `<svg viewBox=""></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "",
        },
      ],
    },
    {
      code: `<img alt="image" src="/assets/image.png">`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
      ],
    },
    {
      code: `<img alt="" src="/assets/image.png">`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
      ],
    },
    {
      code: `<div></div>`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
      ],
    },
    {
      code: `<script></script>`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
      ],
    },
  ],
  invalid: [
    {
      code: `<svg></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'viewBox' attributes for 'svg' tag",
        },
      ],
    },
    {
      code: `<svg></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "0 0 100 100",
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'viewBox' attributes for 'svg' tag",
        },
      ],
    },
    {
      code: `<svg viewBox=""></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "0 0 100 100",
        },
      ],
      errors: [
        {
          line: 1,
          column: 6,
          endColumn: 16,
          message:
            "Unexpected 'viewBox' attributes value. '0 0 100 100' is expected",
        },
      ],
    },
    {
      code: `<svg viewBox></svg>`,
      options: [
        {
          tag: "svg",
          attr: "viewBox",
          value: "0 0 100 100",
        },
      ],
      errors: [
        {
          line: 1,
          column: 6,
          endColumn: 13,
          message:
            "Unexpected 'viewBox' attributes value. '0 0 100 100' is expected",
        },
      ],
    },
    {
      code: `<img/>`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'alt' attributes for 'img' tag",
        },
      ],
    },
    {
      code: `<script></script>`,
      options: [
        {
          tag: "script",
          attr: "src",
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'src' attributes for 'script' tag",
        },
      ],
    },
    {
      code: `<style type="txt/css"></style>`,
      options: [
        {
          tag: "style",
          attr: "type",
          value: "text/css",
        },
      ],
      errors: [
        {
          line: 1,
          column: 8,
          endColumn: 22,
          message: "Unexpected 'type' attributes value. 'text/css' is expected",
        },
      ],
    },
    {
      code: `<img class="image"/>`,
      options: [
        {
          tag: "img",
          attr: "alt",
        },
        {
          tag: "img",
          attr: "class",
          value: "img",
        },
      ],
      errors: [
        {
          line: 1,
          column: 1,
          message: "Missing 'alt' attributes for 'img' tag",
        },
        {
          line: 1,
          column: 6,
          endColumn: 19,
          message: "Unexpected 'class' attributes value. 'img' is expected",
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] require-attrs", rule, {
  valid: [
    {
      code: "html`<svg viewBox></svg>`",
      options: [
        {
          tag: "svg",
          attr: "viewBox",
        },
      ],
    },
  ],
  invalid: [
    {
      code: 'html`<img class="image"/>`',
      options: [
        {
          tag: "img",
          attr: "alt",
        },
        {
          tag: "img",
          attr: "class",
          value: "img",
        },
      ],
      errors: [
        {
          line: 1,
          column: 6,
          message: "Missing 'alt' attributes for 'img' tag",
        },
        {
          line: 1,
          column: 11,
          endColumn: 24,
          message: "Unexpected 'class' attributes value. 'img' is expected",
        },
      ],
    },
  ],
});
