const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/id-naming-convention");

const ruleTester = createRuleTester();

ruleTester.run("id-naming-convention", rule, {
  valid: [
    {
      code: `<div id="camelCase"> </div>`,
      options: ["camelCase"],
    },
    {
      code: `<div id="PascalCase"> </div>`,
      options: ["PascalCase"],
    },
    {
      code: `<div id="kebab-case"> </div>`,
      options: ["kebab-case"],
    },
    {
      code: `<div id="snake_case"> </div>`,
      options: ["snake_case"],
    },
  ],
  invalid: [
    {
      code: `<div id="kebab-case"> </div>`,
      options: ["PascalCase"],
      errors: [
        {
          message: "The id 'kebab-case' is not matched with the PascalCase.",
        },
      ],
    },
    {
      code: `<div id="kebab-case"> </div>`,
      options: ["snake_case"],
      errors: [
        {
          message: "The id 'kebab-case' is not matched with the snake_case.",
        },
      ],
    },
  ],
});
