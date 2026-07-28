const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-duplicate-in-head");
const { TEMPLATE_ENGINE_SYNTAX } = require("@html-eslint/parser");

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
    // Duplicate head tags in mutually exclusive Twig if/else branches are
    // not errors — only one branch's tag appears in the rendered output.
    {
      code: `
        <html>
          <head>
            {% if lang == "en" %}
              <title>English Page</title>
            {% else %}
              <title>Other Language Page</title>
            {% endif %}
          </head>
        </html>
      `,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
    },
    // Multiple head tag types, each duplicated across branches.
    {
      code: `
        <html>
          <head>
            {% if canonical %}
              <link rel="canonical" href="https://example.com/a">
              <meta name="viewport" content="width=device-width">
            {% else %}
              <link rel="canonical" href="https://example.com/b">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            {% endif %}
          </head>
        </html>
      `,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
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
    // Duplicate head tags in two SEPARATE if-blocks (not one if/else) can
    // both render simultaneously and must still be reported.
    {
      code: `
        <html>
          <head>
            {% if cond %}
              <title>First</title>
            {% endif %}
            {% if other %}
              <title>Second</title>
            {% endif %}
          </head>
        </html>
      `,
      languageOptions: {
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
      errors: [
        {
          messageId: "duplicateTag",
          data: { tag: "title" },
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
    {
      code: `
        const template = /* html */\`
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
    {
      code: `
        const template = /* html */\`
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
