const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-in-head");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-duplicate-in-head", rule, {
  valid: [
    {
      code: `
        <html>
          <head>
            <title>Test</title>
          </head>
        </html>
      `,
    },
    {
      code: `
        <html>
          <head>
            <title>Test</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <link rel="canonical" href="https://example.com">
            <base href="https://example.com">
          </head>
        </html>
      `,
    },
    {
      code: `
        <html>
          <head>
            <meta name="description" content="Test">
            <meta name="keywords" content="test">
          </head>
        </html>
      `,
    },
  ],
  invalid: [
    {
      code: `
        <html>
          <head>
            <title>Test</title>
            <title>Another Title</title>
          </head>
        </html>
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "title" },
        },
      ],
    },
    {
      code: `
        <html>
          <head>
            <meta charset="utf-8">
            <meta charset="iso-8859-1">
          </head>
        </html>
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "meta[charset]" },
        },
      ],
    },
    {
      code: `
        <html>
          <head>
            <meta name="viewport" content="width=device-width">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
        </html>
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "meta[name=viewport]" },
        },
      ],
    },
    {
      code: `
        <html>
          <head>
            <link rel="canonical" href="https://example.com">
            <link rel="canonical" href="https://example.org">
          </head>
        </html>
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "link[rel=canonical]" },
        },
      ],
    },
    {
      code: `
        <html>
          <head>
            <base href="https://example.com">
            <base href="https://example.org">
          </head>
        </html>
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "base" },
        },
      ],
    },
  ],
});

// Template literal tests
templateRuleTester.run("[template] no-duplicate-in-head", rule, {
  valid: [
    {
      code: `
        const template = html\`
          <html>
            <head>
              <title>Test</title>
            </head>
          </html>
        \`;
      `,
    },
  ],
  invalid: [
    {
      code: `
        const template = html\`
          <html>
            <head>
              <title>Test</title>
              <title>Another Title</title>
            </head>
          </html>
        \`;
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "title" },
        },
      ],
    },
  ],
});

// Basic template literal tests to cover the uncovered lines
const basicRuleTester = createRuleTester("espree");

basicRuleTester.run("[basic-template] no-duplicate-in-head", rule, {
  valid: [
    {
      code: `
        const template = \`
          <html>
            <head>
              <title>Test</title>
            </head>
          </html>
        \`;
      `,
    },
  ],
  invalid: [
    {
      code: `
        const template = \`
          <html>
            <head>
              <title>Test</title>
              <title>Another Title</title>
            </head>
          </html>
        \`;
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "title" },
        },
      ],
    },
  ],
});