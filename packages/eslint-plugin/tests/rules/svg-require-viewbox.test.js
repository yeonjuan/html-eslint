const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/svg-require-viewbox");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("svg-require-viewbox", rule, {
  valid: [
    {
      code: `<svg viewBox="0 0 100 100"></svg>`,
    },
    {
      code: `<svg viewBox="0 0 200 300"><rect width="100" height="100"/></svg>`,
    },
    {
      code: `<svg viewBox="0 0 24 24" width="24" height="24"></svg>`,
    },
    {
      code: `<div></div>`,
    },
    {
      code: `<img src="icon.png">`,
    },
  ],
  invalid: [
    {
      code: `<svg></svg>`,
      errors: [
        {
          messageId: "missing",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: `<svg width="100" height="100"></svg>`,
      errors: [
        {
          messageId: "missing",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: `<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z"/></svg>`,
      errors: [
        {
          messageId: "missing",
          line: 1,
          column: 1,
        },
      ],
    },
    {
      code: `<div><svg width="24" height="24"><circle cx="12" cy="12" r="10"/></svg></div>`,
      errors: [
        {
          messageId: "missing",
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: `<svg viewBox=""></svg>`,
      errors: [
        {
          messageId: "empty",
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: `<svg viewBox=" "></svg>`,
      errors: [
        {
          messageId: "empty",
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: `<svg viewBox="   " width="100" height="100"></svg>`,
      errors: [
        {
          messageId: "empty",
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: `<SVG viewBox="   " width="100" height="100"></SVG>`,
      errors: [
        {
          messageId: "empty",
          line: 1,
          column: 6,
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] svg-require-viewbox", rule, {
  valid: [
    {
      code: `html\`<svg viewBox="0 0 100 100"></svg>\``,
    },
    {
      code: `html\`<svg viewBox="0 0 24 24" width="24" height="24"></svg>\``,
    },
    {
      code: `html\`<svg viewBox="\${viewBox}"></svg>\``,
    },
    {
      code: `html\`<div><svg viewBox="0 0 100 100"></svg></div>\``,
    },
  ],
  invalid: [
    {
      code: `html\`<svg></svg>\``,
      errors: [
        {
          messageId: "missing",
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: `html\`<svg width="100" height="100"></svg>\``,
      errors: [
        {
          messageId: "missing",
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: `html\`<svg viewBox=""></svg>\``,
      errors: [
        {
          messageId: "empty",
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: `html\`<svg viewBox=" "></svg>\``,
      errors: [
        {
          messageId: "empty",
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: `html\`<div><svg width="24" height="24"></svg></div>\``,
      errors: [
        {
          messageId: "missing",
          line: 1,
          column: 11,
        },
      ],
    },
  ],
});
