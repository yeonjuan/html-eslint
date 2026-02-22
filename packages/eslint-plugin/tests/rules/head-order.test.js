const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/head-order");

const ruleTester = createRuleTester();
const templateRuleTester = createRuleTester("espree");

ruleTester.run("head-order", rule, {
  valid: [
    // Optimal order: META (10) -> TITLE (9) -> PRECONNECT (8) -> ASYNC_SCRIPT (7) ->
    // IMPORT_STYLES (6) -> SYNC_SCRIPT (5) -> SYNC_STYLES (4) -> PRELOAD (3) ->
    // DEFER_SCRIPT (2) -> PREFETCH_PRERENDER (1) -> OTHER (0)
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test Page</title>
  <link rel="preconnect" href="https://example.com">
  <script src="script.js" async></script>
  <style>@import url('styles.css');</style>
  <script>console.log('sync');</script>
  <style>body { color: red; }</style>
  <link rel="preload" href="font.woff" as="font">
  <script src="deferred.js" defer></script>
  <link rel="prefetch" href="next-page.html">
</head>
</html>
      `,
    },
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <title>Another Page</title>
</head>
</html>
      `,
    },
    {
      code: `
<html>
<head>
  <base href="/">
  <title>Base Test</title>
</head>
</html>
      `,
    },
    // Empty head
    {
      code: `
<html>
<head>
</head>
</html>
      `,
    },
    // Single element
    {
      code: `
<html>
<head>
  <title>Single</title>
</head>
</html>
      `,
    },
    // With ignores - script tags ignored
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="stylesheet" href="styles.css">
  <script src="analytics.js" defer></script>
  <script src="tracking.js" defer></script>
</head>
</html>
      `,
      options: [{ ignores: [{ tagPattern: "^script$" }] }],
    },
    // With ignores - specific link with rel="preconnect" ignored
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <script src="deferred.js" defer></script>
  <link rel="preconnect" href="https://analytics.com">
</head>
</html>
      `,
      options: [
        {
          ignores: [
            {
              tagPattern: "^link$",
              attrKeyPattern: "^rel$",
              attrValuePattern: "preconnect",
            },
          ],
        },
      ],
    },
    // With ignores - multiple conditions (AND)
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="stylesheet" href="styles.css">
  <script src="analytics.js" defer></script>
</head>
</html>
      `,
      options: [
        {
          ignores: [{ tagPattern: "^script$", attrValuePattern: "analytics" }],
        },
      ],
    },
    // With ignores - attribute key pattern matching specific attribute
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://example.com" data-ignore="true">
</head>
</html>
      `,
      options: [{ ignores: [{ attrKeyPattern: "^data-ignore$" }] }],
    },
    // With ignores - tag and attribute value pattern (AND condition) - all scripts ignored
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="stylesheet" href="styles.css">
  <script src="app.js"></script>
  <script src="analytics.js"></script>
</head>
</html>
      `,
      options: [{ ignores: [{ tagPattern: "^script$" }] }],
    },
    // With HTML comments - comments maintain their position
    {
      code: `
<html>
<head>
  <!-- This is a comment -->
  <meta charset="UTF-8">
  <title>Test</title>
  <!-- Another comment -->
  <link rel="stylesheet" href="styles.css">
  <!-- Final comment -->
</head>
</html>
      `,
    },
    // With HTML comments mixed with elements
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <!-- Comment between meta and title -->
  <title>Test</title>
  <link rel="preconnect" href="https://example.com">
  <!-- Comment before script -->
  <script src="script.js" async></script>
</head>
</html>
      `,
    },
  ],
  invalid: [
    // TITLE (9) should come before PRECONNECT (8)
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://example.com">
  <title>Test</title>
</head>
</html>
      `,
      output: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="preconnect" href="https://example.com">
</head>
</html>
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "TITLE",
            currentCategory: "PRECONNECT",
          },
        },
      ],
    },
    // META (10) should come before TITLE (9)
    {
      code: `
<html>
<head>
  <title>Test</title>
  <meta charset="UTF-8">
</head>
</html>
      `,
      output: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
</head>
</html>
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "META",
            currentCategory: "TITLE",
          },
        },
      ],
    },
    // SYNC_STYLES (4) should come before PRELOAD (3)
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="preload" href="font.woff" as="font">
  <link rel="stylesheet" href="styles.css">
</head>
</html>
      `,
      output: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preload" href="font.woff" as="font">
</head>
</html>
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "SYNC_STYLES",
            currentCategory: "PRELOAD",
          },
        },
      ],
    },
    // ASYNC_SCRIPT (7) should come before SYNC_SCRIPT (5)
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <script>console.log('sync');</script>
  <script src="async.js" async></script>
</head>
</html>
      `,
      output: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <script src="async.js" async></script>
  <script>console.log('sync');</script>
</head>
</html>
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "ASYNC_SCRIPT",
            currentCategory: "SYNC_SCRIPT",
          },
        },
      ],
    },
    // Multiple ordering violations
    {
      code: `
<html>
<head>
  <link rel="stylesheet" href="styles.css">
  <meta charset="UTF-8">
  <script src="deferred.js" defer></script>
  <title>Test</title>
</head>
</html>
      `,
      output: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="stylesheet" href="styles.css">
  <script src="deferred.js" defer></script>
</head>
</html>
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "META",
            currentCategory: "SYNC_STYLES",
          },
        },
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "TITLE",
            currentCategory: "DEFER_SCRIPT",
          },
        },
      ],
    },
    // PRECONNECT (8) should come before DEFER_SCRIPT (2)
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <script src="deferred.js" defer></script>
  <link rel="preconnect" href="https://example.com">
</head>
</html>
      `,
      output: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="preconnect" href="https://example.com">
  <script src="deferred.js" defer></script>
</head>
</html>
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "PRECONNECT",
            currentCategory: "DEFER_SCRIPT",
          },
        },
      ],
    },
    // With ignores - ignored tags maintain position, others are sorted
    {
      code: `
<html>
<head>
  <link rel="stylesheet" href="styles.css">
  <meta charset="UTF-8">
  <script src="ignored.js" defer></script>
  <title>Test</title>
</head>
</html>
      `,
      output: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <script src="ignored.js" defer></script>
  <link rel="stylesheet" href="styles.css">
</head>
</html>
      `,
      options: [
        { ignores: [{ tagPattern: "^script$", attrValuePattern: "ignored" }] },
      ],
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "META",
            currentCategory: "SYNC_STYLES",
          },
        },
      ],
    },
    // With ignores - multiple ignore patterns
    {
      code: `
<html>
<head>
  <link rel="stylesheet" href="styles.css">
  <meta charset="UTF-8">
  <script src="analytics.js"></script>
  <title>Test</title>
  <link rel="preconnect" href="https://cdn.example.com">
</head>
</html>
      `,
      output: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <script src="analytics.js"></script>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://cdn.example.com">
</head>
</html>
      `,
      options: [
        {
          ignores: [
            { tagPattern: "^script$", attrValuePattern: "analytics" },
            { tagPattern: "^link$", attrValuePattern: "cdn" },
          ],
        },
      ],
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "META",
            currentCategory: "SYNC_STYLES",
          },
        },
      ],
    },
    // IMPORT_STYLES (6) should come before SYNC_SCRIPT (5)
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <script>console.log('sync');</script>
  <style>@import url('fonts.css');</style>
</head>
</html>
      `,
      output: `
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <style>@import url('fonts.css');</style>
  <script>console.log('sync');</script>
</head>
</html>
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "IMPORT_STYLES",
            currentCategory: "SYNC_SCRIPT",
          },
        },
      ],
    },
    // With HTML comments - TITLE should come before PRECONNECT, comments maintain position
    {
      code: `
<html>
<head>
  <meta charset="UTF-8">
  <!-- Comment before link -->
  <link rel="preconnect" href="https://example.com">
  <!-- Comment before title -->
  <title>Test</title>
</head>
</html>
      `,
      output: `
<html>
<head>
  <meta charset="UTF-8">
  <!-- Comment before link -->
  <title>Test</title>
  <!-- Comment before title -->
  <link rel="preconnect" href="https://example.com">
</head>
</html>
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "TITLE",
            currentCategory: "PRECONNECT",
          },
        },
      ],
    },
    // With HTML comments - META should come before TITLE, comments maintain position
    {
      code: `
<html>
<head>
  <!-- Header comment -->
  <title>Test</title>
  <!-- Comment between -->
  <meta charset="UTF-8">
  <!-- Footer comment -->
</head>
</html>
      `,
      output: `
<html>
<head>
  <!-- Header comment -->
  <meta charset="UTF-8">
  <!-- Comment between -->
  <title>Test</title>
  <!-- Footer comment -->
</head>
</html>
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "META",
            currentCategory: "TITLE",
          },
        },
      ],
    },
    // With HTML comments - multiple violations with comments
    {
      code: `
<html>
<head>
  <!-- Start -->
  <link rel="stylesheet" href="styles.css">
  <!-- Comment 1 -->
  <meta charset="UTF-8">
  <!-- Comment 2 -->
  <script src="deferred.js" defer></script>
  <!-- Comment 3 -->
  <title>Test</title>
  <!-- End -->
</head>
</html>
      `,
      output: `
<html>
<head>
  <!-- Start -->
  <meta charset="UTF-8">
  <!-- Comment 1 -->
  <title>Test</title>
  <!-- Comment 2 -->
  <link rel="stylesheet" href="styles.css">
  <!-- Comment 3 -->
  <script src="deferred.js" defer></script>
  <!-- End -->
</head>
</html>
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "META",
            currentCategory: "SYNC_STYLES",
          },
        },
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "TITLE",
            currentCategory: "DEFER_SCRIPT",
          },
        },
      ],
    },
  ],
});

templateRuleTester.run("[template] head-order", rule, {
  valid: [
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test Page</title>
  <link rel="preconnect" href="https://example.com">
  <script src="script.js" async></script>
</head>
</html>
\`;
      `,
    },
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
</head>
</html>
\`;
      `,
    },
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="stylesheet" href="styles.css">
  <script src="analytics.js" defer></script>
</head>
</html>
\`;
      `,
      options: [{ ignores: [{ tagPattern: "^script$" }] }],
    },
    // With expressions - meta with expression attribute
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="\${charset}">
  <title>Test</title>
  <link rel="preconnect" href="https://example.com">
</head>
</html>
\`;
      `,
    },
    // With expressions - link with expression in href
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="preconnect" href="\${cdnUrl}">
  <script src="\${scriptUrl}" async></script>
</head>
</html>
\`;
      `,
    },
    // With expressions - script with expression
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <script src="\${asyncScript}" async></script>
  <script src="\${syncScript}"></script>
</head>
</html>
\`;
      `,
    },
    // With HTML comments in template
    {
      code: `
const template = html\`
<html>
<head>
  <!-- Comment -->
  <meta charset="UTF-8">
  <title>Test</title>
  <!-- Another comment -->
  <link rel="stylesheet" href="styles.css">
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
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://example.com">
  <title>Test</title>
</head>
</html>
\`;
      `,
      output: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="preconnect" href="https://example.com">
</head>
</html>
\`;
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "TITLE",
            currentCategory: "PRECONNECT",
          },
        },
      ],
    },
    {
      code: `
const template = html\`
<html>
<head>
  <title>Test</title>
  <meta charset="UTF-8">
</head>
</html>
\`;
      `,
      output: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
</head>
</html>
\`;
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "META",
            currentCategory: "TITLE",
          },
        },
      ],
    },
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="preload" href="font.woff" as="font">
  <link rel="stylesheet" href="styles.css">
</head>
</html>
\`;
      `,
      output: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preload" href="font.woff" as="font">
</head>
</html>
\`;
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "SYNC_STYLES",
            currentCategory: "PRELOAD",
          },
        },
      ],
    },
    // With expressions - TITLE should come before PRECONNECT
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="\${charset}">
  <link rel="preconnect" href="\${cdnUrl}">
  <title>Test</title>
</head>
</html>
\`;
      `,
      output: `
const template = html\`
<html>
<head>
  <meta charset="\${charset}">
  <title>Test</title>
  <link rel="preconnect" href="\${cdnUrl}">
</head>
</html>
\`;
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "TITLE",
            currentCategory: "PRECONNECT",
          },
        },
      ],
    },
    // With expressions - ASYNC_SCRIPT should come before SYNC_SCRIPT
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <script src="\${syncScript}"></script>
  <script src="\${asyncScript}" async></script>
</head>
</html>
\`;
      `,
      output: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <script src="\${asyncScript}" async></script>
  <script src="\${syncScript}"></script>
</head>
</html>
\`;
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "ASYNC_SCRIPT",
            currentCategory: "SYNC_SCRIPT",
          },
        },
      ],
    },
    // With expressions - SYNC_STYLES should come before PRELOAD
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="preload" href="\${fontUrl}" as="font">
  <link rel="stylesheet" href="\${cssUrl}">
</head>
</html>
\`;
      `,
      output: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <link rel="stylesheet" href="\${cssUrl}">
  <link rel="preload" href="\${fontUrl}" as="font">
</head>
</html>
\`;
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "SYNC_STYLES",
            currentCategory: "PRELOAD",
          },
        },
      ],
    },
    // With HTML comments - TITLE should come before PRECONNECT
    {
      code: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <!-- Comment -->
  <link rel="preconnect" href="https://example.com">
  <title>Test</title>
</head>
</html>
\`;
      `,
      output: `
const template = html\`
<html>
<head>
  <meta charset="UTF-8">
  <!-- Comment -->
  <title>Test</title>
  <link rel="preconnect" href="https://example.com">
</head>
</html>
\`;
      `,
      errors: [
        {
          messageId: "wrongOrder",
          data: {
            nextCategory: "TITLE",
            currentCategory: "PRECONNECT",
          },
        },
      ],
    },
  ],
});
