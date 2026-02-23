---
title: no-whitespace-only-children
description: Disallow tags with only whitespace children to avoid unnecessary markup.
---

# no-whitespace-only-children

This rule disallows tags that contain only whitespace characters (spaces, tabs, newlines) as children.

### Why?

This rule is particularly useful when working with web components like [Lit](https://lit.dev/), where slots use fallback content. If a user accidentally adds whitespace (such as a newline) between tags, it can unintentionally override the default slot content, leading to unexpected behavior.

For example, in Lit components:

```html
<!-- ❌ This will override the default slot content with whitespace -->
<my-component> </my-component>

<!-- ✅ This will use the default slot content -->
<my-component></my-component>
```

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-whitespace-only-children": "error",
  },
};
```

### Options

This rule has an object option:

- `"tagPatterns"`: An array of regex patterns (as strings) to match tag names. If specified, only tags matching these patterns will be checked. If not specified, all tags will be checked.

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-whitespace-only-children": [
      "error",
      {
        "tagPatterns": ["^my-component$", "^custom-.*"]
      }
    ],
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule with the `"tagPatterns": ["^custom-element$]` option:

```html,incorrect
<custom-element>

</custom-element>

<custom-element> </custom-element>

<custom-element>
</custom-element>

<custom-element> <!--comment --> </custom-element>
```

Examples of **correct** code for this rule with the `"tagPatterns": ["^custom-element$]` option:

```html,correct
<custom-element> content </custom-element>
<custom-element><!--comment --></custom-element>
```
