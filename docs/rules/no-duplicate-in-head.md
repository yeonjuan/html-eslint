# no-duplicate-head-tags

This rule disallows duplicate tags in the `<head>` section that should be unique.

## Why?

Certain HTML tags in the `<head>` section should appear only once per document for proper functionality and SEO optimization. Having duplicate tags can cause:

- Multiple page titles confusing search engines and browsers
- Conflicting character encodings
- Multiple viewport declarations causing layout issues
- Conflicting base URLs
- Multiple canonical URLs diluting SEO value

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-duplicate-in-head": "error",
  },
};
```

## Rule Details

This rule checks for duplicate occurrences of the following tags within `<head>`:

- `<title>` - Document title
- `<base>` - Base URL for relative URLs
- `<meta charset>` - Character encoding declaration
- `<meta name="viewport">` - Viewport configuration
- `<link rel="canonical">` - Canonical URL declaration

Examples of **incorrect** code for this rule:

```html,incorrect
<head>
  <title>First Title</title>
  <title>Second Title</title>
</head>
```

```html,incorrect
<head>
  <base href="/" />
  <base href="/home" />
</head>
```

```html,incorrect
<head>
  <meta charset="UTF-8" />
  <meta charset="ISO-8859-1" />
</head>
```

```html,incorrect
<head>
  <meta name="viewport" content="width=device-width" />
  <meta name="viewport" content="initial-scale=1" />
</head>
```

```html,incorrect
<head>
  <link rel="canonical" href="https://example.com" />
  <link rel="canonical" href="https://example.org" />
</head>
```

Examples of **correct** code for this rule:

```html,correct
<head>
  <title>Page Title</title>
  <base href="/" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <link rel="canonical" href="https://example.com" />
</head>
```

```html,correct
<head>
  <meta charset="UTF-8" />
  <meta name="description" content="Page description" />
  <meta name="keywords" content="html, css" />
  <link rel="stylesheet" href="style.css" />
</head>
```

Note that tags outside the `<head>` section are not checked by this rule, and other meta tags (like `description`, `keywords`) are allowed to have multiple instances.

## Further Reading

- [MDN: Document metadata](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)
- [MDN: title element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)
- [MDN: base element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)
- [MDN: meta element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
- [MDN: link element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
