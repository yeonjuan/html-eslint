const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/head-order");

const ruleTester = createRuleTester();

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
  ],
});

// Template tests are not applicable for this rule as it analyzes full HTML documents
// The rule requires analyzing the <head> element structure which is specific to .html files
// templateRuleTester.run("[template] head-order", rule, {
//   valid: [],
//   invalid: [],
// });
