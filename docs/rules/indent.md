---
id: indent
title: "indent"
---

# indent

Enforce consistent indentation

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/indent": "error",
  },
};
```

## Rule Details

This rule enforces consistent indentation styles. The default indent is `4 spaces`.

### Options

This rule has two options

- `number(0, 1, ..)` (default 4): requires the use of indentation with specified number of spaces.

- `"tab"`: requires the use of indentation with tab (`\t`).

Examples of **incorrect** code for this rule:

```html
<html>
  <body></body>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <body></body>
</html>
```

#### space

If the option is number it means the number of spaces for indentation.

```json
{
  "@html-eslint/indent": ["error", 2]
}
```

Examples of **incorrect** code for this rule with the `"2"` option:

```html
<html>
  <body></body>
</html>
```

Examples of **correct** code for this rule with the `"2"` option:

```html
<html>
  <body></body>
</html>
```

<!-- prettier-ignore-end -->

#### tab

If the option is `"tab"` it means using `tab` for indentation.

```json
{
  "@html-eslint/indent": ["error", "tab"]
}
```

Examples of **incorrect** code for this rule:

```html
<html>
  <body></body>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <body>
    <!-- tab -->
  </body>
  <!-- tab -->
</html>
```
