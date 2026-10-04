const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/id-naming-convention");

const ruleTester = createRuleTester();

ruleTester.run("id-naming-convention", rule, {
  valid: [
    {
      code: `<div />`,
      options: ["camelCase"],
    },
    {
      code: `<div id="camelCase" />`,
      options: ["camelCase"],
    },
    {
      code: `<div id={dynamicId} />`,
      options: ["camelCase"],
    },
    {
      // Dynamic expression - can't be statically verified
      code: `<div id={\`\${dynamicId}\`} />`,
      options: ["camelCase"],
    },
    {
      // Static string literal inside an expression container
      code: `<div id={"camelCase"} />`,
      options: ["camelCase"],
    },
    {
      // Static template literal (no interpolation) inside an expression
      // container
      code: "<div id={`camelCase`} />",
      options: ["camelCase"],
    },
    {
      code: `<div id="PascalCase" />`,
      options: ["PascalCase"],
    },
    {
      code: `<div id="kebab-case" />`,
      options: ["kebab-case"],
    },
    {
      code: `<div id="snake_case" />`,
      options: ["snake_case"],
    },
    {
      code: `<div id="CuStOmReGeX" />`,
      options: ["regex", { pattern: "^([A-Z][a-z])+[A-Z]?$" }],
    },
    {
      code: `<div id="CuStOmReGeX" />`,
      options: ["regex", { pattern: "^[a-z]+$", flags: "i" }],
    },
  ],
  invalid: [
    {
      code: `<div id="kebab-case" />`,
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
      // Static string literal inside an expression container
      code: `<div id={"kebab-case"} />`,
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
      // Static template literal (no interpolation) inside an expression
      // container
      code: "<div id={`kebab-case`} />",
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
      code: `<div id="kebab-case" />`,
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
      code: `<div id="kebab-case" />`,
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
