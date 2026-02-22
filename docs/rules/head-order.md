# head-order

> Enforce optimal ordering of elements in `<head>`

The order of elements in the `<head>` tag can affect the (perceived) performance of a web page. This rule enforces the optimal ordering of `<head>` elements based on [capo.js](https://github.com/rviscomi/capo.js).

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/head-order": "error",
  },
};
```

## Rule Details

This rule enforces that elements within the `<head>` tag follow the optimal loading order for web performance. Elements are categorized and should appear in this order (from highest to lowest priority):

1. **META** (weight: 10) - Critical meta tags (`<base>`, `<meta charset>`, `<meta name="viewport">`, critical `http-equiv` meta tags)
2. **TITLE** (weight: 9) - The `<title>` element
3. **PRECONNECT** (weight: 8) - `<link rel="preconnect">`
4. **ASYNC_SCRIPT** (weight: 7) - `<script src="..." async>`
5. **IMPORT_STYLES** (weight: 6) - `<style>` elements with `@import`
6. **SYNC_SCRIPT** (weight: 5) - Synchronous `<script>` elements (inline or blocking external scripts)
7. **SYNC_STYLES** (weight: 4) - `<link rel="stylesheet">` and inline `<style>` (without `@import`)
8. **PRELOAD** (weight: 3) - `<link rel="preload">`
9. **DEFER_SCRIPT** (weight: 2) - `<script src="..." defer>` and `<script type="module">`
10. **PREFETCH_PRERENDER** (weight: 1) - `<link rel="prefetch">`, `<link rel="dns-prefetch">`, `<link rel="prerender">`
11. **OTHER** (weight: 0) - Everything else

Examples of **incorrect** code for this rule:

```html
<!-- ✗ BAD: title should come before preconnect -->
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://example.com" />
  <title>Page Title</title>
</head>
```

```html
<!-- ✗ BAD: meta charset should come before title -->
<head>
  <title>Page Title</title>
  <meta charset="UTF-8" />
</head>
```

```html
<!-- ✗ BAD: stylesheet should come before preload -->
<head>
  <meta charset="UTF-8" />
  <title>Page Title</title>
  <link rel="preload" href="font.woff" as="font" />
  <link rel="stylesheet" href="styles.css" />
</head>
```

Examples of **correct** code for this rule:

```html
<!-- ✓ GOOD: optimal order -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title</title>
  <link rel="preconnect" href="https://example.com" />
  <script src="script.js" async></script>
  <style>
    @import url("styles.css");
  </style>
  <script>
    console.log("sync script");
  </script>
  <link rel="stylesheet" href="styles.css" />
  <link rel="preload" href="font.woff" as="font" />
  <script src="deferred.js" defer></script>
  <link rel="prefetch" href="next-page.html" />
</head>
```

```html
<!-- ✓ GOOD: base comes before title (both are META category) -->
<head>
  <base href="/" />
  <meta charset="UTF-8" />
  <title>Page Title</title>
</head>
```

## Why?

The order of elements in the `<head>` affects how quickly a browser can start rendering a page and how soon users can interact with it:

- **Critical metadata** (`charset`, `viewport`) should come first so the browser knows how to interpret the document
- **Title** should come early for accessibility and SEO
- **Preconnect** links should come before resources that use those connections
- **Async scripts** can start downloading early without blocking rendering
- **Synchronous scripts and styles** should be positioned to minimize render-blocking
- **Preloads** should come after render-critical resources
- **Deferred scripts** and **prefetch** resources have lower priority

Following this order can improve Core Web Vitals metrics like First Contentful Paint (FCP) and Largest Contentful Paint (LCP).

## Further Reading

- [capo.js - Get your `<head>` in order](https://github.com/rviscomi/capo.js)
- [CT.css - Let's take a look at your `<head>`](https://csswizardary.com/ct/)
- [Vitaly Friedman - Nordic.js 2022](https://youtu.be/uqLl-Yew2o8?t=2873)
