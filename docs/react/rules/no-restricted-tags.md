---
title: react/no-restricted-tags
description: Disallow specified tags in React/JSX based on custom configuration.
---

# no-restricted-tags

This rule disallows the use of specified tags in React/JSX.

## How to use

```js
// eslint.config.js (flat config)
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      "@html-eslint/react": htmlReact,
    },
    rules: {
      "@html-eslint/react/no-restricted-tags": [
        "error",
        {
          tagPatterns: ["^div$", "^span$"],
          message: "Use semantic elements instead of div and span.",
        },
      ],
    },
  },
];
```

## Rule Details

This rule allows you to specify tags that you don't want to use in your application.

### Options

This rule takes an array of option objects, where the `tagPatterns` are specified.

- `tagPatterns`: An array of strings representing regular expression patterns. It disallows tag names that match any of the patterns.
- `message` (optional): A custom error message to be shown when the rule is triggered.

Examples of **incorrect** code for this rule with the option below:

```json
{
  "tagPatterns": ["^div$", "^span$"],
  "message": "Use semantic elements instead of generic containers"
}
```

```jsx,incorrect
<div>Content</div>
<span>Text</span>
```

Examples of **correct** code for this rule with the option above:

```jsx,correct
<article>Content</article>
<p>Text</p>
<section>Content</section>
```
