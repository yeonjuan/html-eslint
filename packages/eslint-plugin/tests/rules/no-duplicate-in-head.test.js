// @ts-nocheck
/**
 * @fileoverview Tests for no-duplicate-head-tags rule
 */

"use strict";

const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-in-head");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("no-duplicate-head-tags", rule, {
  valid: [
    {
      filename: "test.html",
      code: `
        <head>
          <title>Title One</title>
          <base href="/" />
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width" />
          <link rel="canonical" href="https://example.com" />
        </head>
      `,
    },

    {
      filename: "test.html",
      code: `
        <body>
          <title>Title Outside Head</title>
          <meta charset="UTF-8" />
          <link rel="canonical" href="https://example.com" />
        </body>
      `,
    },
    {
      filename: "test.html",
      code: `
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width" />
        </head>
      `,
    },
    {
      filename: "test.html",
      code: `
        <head>
          <meta name="description" content="Some description" />
          <meta name="keywords" content="html, css" />
          <link rel="stylesheet" href="style.css" />
        </head>
      `,
    },
  ],

  invalid: [
    {
      filename: "test.html",
      code: `
        <head>
          <title>Title One</title>
          <title>Title Two</title>
        </head>
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "title" },
          line: 4,
        },
      ],
    },
    {
      filename: "test.html",
      code: `
        <head>
          <base href="/" />
          <base href="/home" />
        </head>
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "base" },
          line: 4,
        },
      ],
    },
    {
      filename: "test.html",
      code: `
        <head>
          <meta charset="UTF-8" />
          <meta charset="ISO-8859-1" />
        </head>
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "meta[charset]" },
          line: 4,
        },
      ],
    },
    {
      filename: "test.html",
      code: `
        <head>
          <meta name="viewport" content="width=device-width" />
          <meta name="viewport" content="initial-scale=1" />
        </head>
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "meta[name=viewport]" },
          line: 4,
        },
      ],
    },
    {
      filename: "test.html",
      code: `
        <head>
          <link rel="canonical" href="https://example.com" />
          <link rel="canonical" href="https://example.org" />
        </head>
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "link[rel=canonical]" },
          line: 4,
        },
      ],
    },
    // Multi duplicate test case
    {
      filename: "test.html",
      code: `
        <head>
          <title>One</title>
          <title>Two</title>
          <base href="/" />
          <base href="/home" />
          <meta charset="UTF-8" />
          <meta charset="ISO-8859-1" />
          <meta name="viewport" content="width=device-width" />
          <meta name="viewport" content="initial-scale=1" />
          <link rel="canonical" href="https://example.com" />
          <link rel="canonical" href="https://example.org" />
        </head>
      `,
      errors: [
        { messageId: "duplicateTag", data: { tag: "title" }, line: 4 },
        { messageId: "duplicateTag", data: { tag: "base" }, line: 6 },
        { messageId: "duplicateTag", data: { tag: "meta[charset]" }, line: 8 },
        { messageId: "duplicateTag", data: { tag: "meta[name=viewport]" }, line: 10 },
        { messageId: "duplicateTag", data: { tag: "link[rel=canonical]" }, line: 12 },
      ],
    },
    // Test with multiple duplicates of the same tag
    {
      filename: "test.html",
      code: `
        <head>
          <title>One</title>
          <title>Two</title>
          <title>Three</title>
        </head>
      `,
      errors: [
        { messageId: "duplicateTag", data: { tag: "title" }, line: 4 },
        { messageId: "duplicateTag", data: { tag: "title" }, line: 5 },
      ],
    },
  ],
});

// Template literal tests
templateRuleTester.run("[template] no-duplicate-head-tags", rule, {
  valid: [
    {
      code: `
        html\`<head>
          <title>Title One</title>
          <base href="/" />
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width" />
          <link rel="canonical" href="https://example.com" />
        </head>\`
      `,
    },
    {
      code: `
        html\`<head>
          <meta name="description" content="Some description" />
          <meta name="keywords" content="html, css" />
        </head>\`
      `,
    },
  ],
  invalid: [
    {
      code: `
        html\`<head>
          <title>One</title>
          <title>Two</title>
        </head>\`
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "title" },
          line: 4,
        },
      ],
    },
    {
      code: `
        html\`<head>
          <meta charset="UTF-8" />
          <meta charset="ISO-8859-1" />
        </head>\`
      `,
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "meta[charset]" },
          line: 4,
        },
      ],
    },
    {
      code: `
        html\`<head>
          <base href="/" />
          <base href="/home" />
          <base href="/other" />
        </head>\`
      `,
      errors: [
        { messageId: "duplicateTag", data: { tag: "base" }, line: 4 },
        { messageId: "duplicateTag", data: { tag: "base" }, line: 5 },
      ],
    },
  ],
});