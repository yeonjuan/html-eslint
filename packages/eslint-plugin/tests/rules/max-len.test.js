const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/max-len");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

// <div class="XXX"></div> = 12 + XXX + 8 = 20 + XXX
// 60 a's → 80 chars (at limit)
// 61 a's → 81 chars (over limit)

ruleTester.run("max-len", rule, {
  valid: [
    // exactly at the limit (default 80) — 12 + 60 + 8 = 80
    {
      code: `<div class="${"a".repeat(60)}"></div>`,
      options: [{ max: 80 }],
    },
    // short line
    {
      code: "<div></div>",
      options: [{ max: 80 }],
    },
    // multi-line, all within limit
    {
      code: `<div>\n  <span></span>\n</div>`,
      options: [{ max: 80 }],
    },
    // custom large limit — long line is fine
    {
      code: `<div class="${"a".repeat(100)}"></div>`,
      options: [{ max: 200 }],
    },
    // empty document
    {
      code: "",
      options: [{ max: 80 }],
    },
  ],
  invalid: [
    // single line exceeds: 12 + 61 + 8 = 81 > 80
    {
      code: `<div class="${"a".repeat(61)}"></div>`,
      options: [{ max: 80 }],
      errors: [
        {
          messageId: "exceed",
          line: 1,
          column: 81,
        },
      ],
    },
    // multi-line: line 2 is "  <span class="XXX"></span>"
    // 15 + 57 + 9 = 81 > 80
    {
      code: `<div>\n  <span class="${"a".repeat(57)}"></span>\n</div>`,
      options: [{ max: 80 }],
      errors: [
        {
          messageId: "exceed",
          line: 2,
          column: 81,
        },
      ],
    },
    // both lines exceed
    {
      code: `<div class="${"a".repeat(61)}"></div>\n<span class="${"a".repeat(
        61
      )}"></span>`,
      options: [{ max: 80 }],
      errors: [
        {
          messageId: "exceed",
          line: 1,
        },
        {
          messageId: "exceed",
          line: 2,
        },
      ],
    },
    // custom max=10: any line >10 chars triggers it
    {
      code: "<div></div>",
      options: [{ max: 10 }],
      errors: [
        {
          messageId: "exceed",
          line: 1,
          column: 11,
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] max-len", rule, {
  valid: [
    {
      code: `html\`<div></div>\``,
      options: [{ max: 80 }],
    },
  ],
  invalid: [
    // html`<div class="XXX"></div>` — line is embedded inside template literal
    // 12 + 61 + 8 = 81 chars in the HTML line
    {
      code: `html\`<div class="${"a".repeat(61)}"></div>\``,
      options: [{ max: 80 }],
      errors: [
        {
          messageId: "exceed",
        },
      ],
    },
  ],
});
