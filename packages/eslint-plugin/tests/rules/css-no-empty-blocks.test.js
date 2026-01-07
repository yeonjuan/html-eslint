/**
 * Based on
 * https://github.com/eslint/css/blob/main/tests/rules/no-empty-blocks.test.js
 */

const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/css-no-empty-blocks");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("css-no-empty-blocks", rule, {
  valid: [
    {
      code: "<style> a { color: red; } </style>",
    },
  ],
  invalid: [
    {
      code: "<style>a { }</style>",
      errors: [
        {
          messageId: "emptyBlock",
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 13,
        },
      ],
    },
    {
      code: "<style>a { /* comment */ }</style>",
      errors: [
        {
          messageId: "emptyBlock",
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 27,
        },
      ],
    },
    {
      code: "<style>a {\n}</style>",
      errors: [
        {
          messageId: "emptyBlock",
          line: 1,
          column: 10,
          endLine: 2,
          endColumn: 2,
        },
      ],
    },
    {
      code: "<style>a { \n }</style>",
      errors: [
        {
          messageId: "emptyBlock",
          line: 1,
          column: 10,
          endLine: 2,
          endColumn: 3,
        },
      ],
    },
    {
      code: `<style>
 a { }
</style>`,
      errors: [
        {
          messageId: "emptyBlock",
          line: 2,
          column: 4,
          endLine: 2,
          endColumn: 7,
        },
      ],
    },
    {
      code: "<style>@media print { }</style>",
      errors: [
        {
          messageId: "emptyBlock",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 24,
        },
      ],
    },
    {
      code: "<style>a { }\n@media print { \nb { } \n}</style>",
      errors: [
        {
          messageId: "emptyBlock",
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 13,
        },
        {
          messageId: "emptyBlock",
          line: 3,
          column: 3,
          endLine: 3,
          endColumn: 6,
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] css-no-empty-blocks", rule, {
  valid: [],
  invalid: [],
});
