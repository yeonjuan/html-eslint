---
title: no-restricted-tags
description: Disallow specified HTML tags based on custom configuration.
---
# no-restricted-tags

This rule disallows the use of specified tags.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-restricted-tags": [
      "error",
      {
        tagPatterns: ["^div$", "^span$"],
        message: "Use semantic elements instead of div and span.",
      },
    ],
  },
};
```

## Rule Details

This rule allows you to specify tags that you don't want to use in your application.

### Options

This rule takes an array of option objects, where the `tagPatterns` are specified.

- `tagPatterns`: An array of strings representing regular expression patterns. It disallows tag names that match any of the patterns.
- `message` (optional): A custom error message to be shown when the rule is triggered.

```js
module.exports = {
  rules: {
    "@html-eslint/no-restricted-tags": [
      "error",
      {
        tagPatterns: ["^div$", "^span$"],
        message: "Use semantic elements instead of div and span.",
      },
      {
        tagPatterns: ["h[1-6]"],
        message: "Heading tags are not allowed in this context.",
      },
      {
        tagPatterns: [".*-.*"],
        message: "Custom elements should follow naming conventions.",
      },
    ],
  },
};
```

Examples of **incorrect** code for this rule with the option below:

```json
{
  "tagPatterns": ["^div$", "^span$"],
  "message": "Use semantic elements instead of generic containers"
}
```

```html,incorrect
<div>Content</div>
<span>Text</span>
```

Examples of **correct** code for this rule with the option above:

```html,correct
<article>Content</article>
<p>Text</p>
<section>Content</section>
```

Examples of **incorrect** code for this rule with regex patterns:

```json
{
  "tagPatterns": ["h[1-6]"],
  "message": "Heading tags are restricted"
}
```

```html,incorrect
<h1>Title</h1>
<h2>Subtitle</h2>
<h3>Section</h3>
```

Examples of **incorrect** code for this rule with custom element patterns:

```json
{
  "tagPatterns": [".*-.*"],
  "message": "Custom elements should follow naming conventions"
}
```

```html,incorrect
<custom-element></custom-element>
<my-component></my-component>
```

Examples of **incorrect** code for this rule with deprecated tags:

```json
{
  "tagPatterns": ["font|center|marquee"],
  "message": "Deprecated HTML tags are not allowed"
}
```

```html,incorrect
<font size="3">Old style text</font>
<center>Centered content</center>
<marquee>Scrolling text</marquee>
```
