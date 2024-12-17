const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-input-label");

const ruleTester = createRuleTester();

ruleTester.run("require-input-label", rule, {
  valid: [
    {
      code: `<input id="foo"></input>`,
    },
    {
      code: `<textarea id="foo"></input>`,
    },
    {
      code: `<input type="hidden"></input>`,
    },
    {
      code: `<label>name: <input></input></label>`,
    },
    {
      code: `<textarea aria-labelledby="foo" />`,
    },
  ],
  invalid: [
    {
      code: `<input></input>`,
      errors: [
        {
          messageId: "missingLabel",
        },
      ],
    },
    {
      code: `<label>name: </label><input></input>`,
      errors: [
        {
          messageId: "missingLabel",
        },
      ],
    },
  ],
});
