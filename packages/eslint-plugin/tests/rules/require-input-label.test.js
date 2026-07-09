const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/require-input-label");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("require-input-label", rule, {
  valid: [
    {
      code: `<label for="foo">Foo</label><input id="foo">`,
    },
    {
      code: `<label for="foo">Foo</label><textarea id="foo"></textarea>`,
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

templateRuleTester.run("[template] require-input-label", rule, {
  valid: [
    {
      code: `html\`<label for="foo">Foo</label><input id="foo">\``,
    },
    {
      code: `html\`<label>name: <input></label>\``,
    },
    {
      // label and input in same nested doc → valid
      code: 'html`${html`<label for="foo">Foo</label><input id="foo">`}`',
    },
  ],
  invalid: [
    {
      code: `html\`<input type="text">\``,
      errors: [
        {
          messageId: "missingLabel",
        },
      ],
    },
    {
      // label in outer doc, input in inner doc → inner input not labeled
      code: 'html`<label for="foo">Foo</label>${html`<input id="foo">`}`',
      errors: [
        {
          messageId: "missingLabel",
        },
      ],
    },
    {
      // label in inner doc, input in outer doc → outer input not labeled
      code: 'html`<input id="foo">${html`<label for="foo">Foo</label>`}`',
      errors: [
        {
          messageId: "missingLabel",
        },
      ],
    },
  ],
});
