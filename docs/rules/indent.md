# indent

This rule enforces consistent indentation.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/indent": "error",
  },
};
```

## Rule Details

### Options

This rule has a mixed option:

For 4-space indentation (detault option):

```json
{
  "@html-eslint/indent": ["error", 4]
}
```

Or For tabbed indentation:

```json
{
  "@html-eslint/indent": ["error", "tab"]
}
```

Examples of **incorrect** code for this rule with the default option:

```html,incorrect
<html>
  <body></body>
</html>
```

Examples of **correct** code for this rule:

<!-- prettier-ignore -->
```html,correct
<html>
    <body></body>
</html>
```

#### number (default: 4)

If the option is number it means the number of spaces for indentation.

```json
{
  "@html-eslint/indent": ["error", 2]
}
```

Examples of **incorrect** code for this rule with the `"2"` option:

<!-- prettier-ignore -->
```html,incorrect
<html>
      <body></body>
</html>
```

Examples of **correct** code for this rule with the `"2"` option:

```html,correct
<html>
  <body></body>
</html>
```

#### tab

If the option is `"tab"` it means using `tab` for indentation.

```json
{
  "@html-eslint/indent": ["error", "tab"]
}
```

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html,incorrect
<html>
          <body></body>
</html>
```

Examples of **correct** code for this rule:

```html,correct
<html>
  <body></body>
</html>
```

#### Customizing options

This rule has an object option:

```json
{
  "@html-eslint/indent": [
    "error",
    2,
    {
      "Attribute": 2
    }
  ]
}
```

- `Attribute` (default: 1): enforces indentation level for attributes. e.g. indent of 2 spaces with `Attribute` set to `2` will indent the attributes with `4` spaces (2 x 2).
