import createRuleTester from "../rule-tester.js";
import rule from "../../lib/rules/id-naming-convention.js";

const ruleTester = createRuleTester();

ruleTester.run("id-naming-convention", rule, {
  valid: [
    {
      code: "<div></div>",
      options: ["camelCase"],
    },
    {
      code: '<div id="camelCase"></div>',
      options: ["camelCase"],
    },
    {
      code: "<div id={dynamicId}></div>",
      options: ["camelCase"],
    },
    {
      code: '<div id="PascalCase"></div>',
      options: ["PascalCase"],
    },
    {
      code: '<div id="kebab-case"></div>',
      options: ["kebab-case"],
    },
    {
      code: '<div id="snake_case"></div>',
      options: ["snake_case"],
    },
    {
      code: '<div id="CuStOmReGeX"></div>',
      options: ["regex", { pattern: "^([A-Z][a-z])+[A-Z]?$" }],
    },
    {
      code: '<div id="CuStOmReGeX"></div>',
      options: ["regex", { pattern: "^[a-z]+$", flags: "i" }],
    },
  ],
  invalid: [
    {
      code: '<div id="kebab-case"></div>',
      options: ["PascalCase"],
      errors: [
        {
          messageId: "wrong",
          data: { actual: "kebab-case", convention: "PascalCase" },
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: '<div id="kebab-case"></div>',
      options: ["snake_case"],
      errors: [
        {
          messageId: "wrong",
          data: { actual: "kebab-case", convention: "snake_case" },
          line: 1,
          column: 6,
        },
      ],
    },
    {
      code: '<div id="kebab-case"></div>',
      options: ["regex", { pattern: "^([A-Z][a-z])+[A-Z]?$" }],
      errors: [
        {
          messageId: "wrong",
          data: { actual: "kebab-case", convention: "regex" },
          line: 1,
          column: 6,
        },
      ],
    },
  ],
});
