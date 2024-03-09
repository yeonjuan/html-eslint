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
    {
      code: `<div id="CuStOmReGeX"> </div>`,
      options: ["regex", { pattern: "^([A-Z][a-z])+[A-Z]?$" }],
    },
    {
      code: `<div id="CuStOmReGeX"> </div>`,
      options: ["regex", { pattern: "^[a-z]+$", flags: "i" }],
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
    {
      code: `<div id="kebab-case"> </div>`,
      options: ["regex", { pattern: "^([A-Z][a-z])+[A-Z]?$" }],
      errors: [
        {
          message: "The id 'kebab-case' is not matched with the regex.",
        },
      ],
    },
    {
      code: `<div id="kebab-case"> </div>`,
      options: ["regex", { pattern: "^([A-Z][a-z])+[A-Z]?$", flags: "i" }],
      errors: [
        {
          message: "The id 'kebab-case' is not matched with the regex.",
        },
      ],
    },
  ],
});
