const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-input-label");

const ruleTester = createRuleTester();

ruleTester.run("require-input-label", rule, {
  valid: [
    {
      code: `<input id="foo">`,
    },
    {
      code: `<textarea id="foo"></textarea>`,
    },
    {
      code: `<input type="hidden">`,
    },
    {
      code: `<label>name: <input></label>`,
    },
    {
      code: `<textarea aria-labelledby="foo" />`,
    },
    {
      code: `<textarea aria-label="foo" />`,
    },
  ],
  invalid: [
    {
      code: `<input type="text">`,
      errors: [
        {
          messageId: "missingLabel",
        },
      ],
    },
    {
      code: `<textarea></textarea>`,
      errors: [
        {
          messageId: "missingLabel",
        },
      ],
    },
    {
      code: `<label>name: </label><input type="text">`,
      errors: [
        {
          messageId: "missingLabel",
        },
      ],
    },
  ],
});