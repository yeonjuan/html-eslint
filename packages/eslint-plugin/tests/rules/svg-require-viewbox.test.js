const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/svg-require-viewbox");

const ruleTester = createRuleTester();

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
      errors: [{ messageId: "missing" }],
    },
    {
      code: `<svg width="100" height="100"></svg>`,
      errors: [{ messageId: "missing" }],
    },
    {
      code: `<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z"/></svg>`,
      errors: [{ messageId: "missing" }],
    },
    {
      code: `<div><svg width="24" height="24"><circle cx="12" cy="12" r="10"/></svg></div>`,
      errors: [{ messageId: "missing" }],
    },
  ],
});
