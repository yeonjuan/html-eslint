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
  ],
});

// Template tests are not applicable for this rule as it analyzes full HTML documents
// The rule requires analyzing the <head> element structure which is specific to .html files
// templateRuleTester.run("[template] head-order", rule, {
//   valid: [],
//   invalid: [],
// });
