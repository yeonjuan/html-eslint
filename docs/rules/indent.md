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

For 4-space indentation (default option):

```json
{
  "@html-eslint/indent": ["error", 4]
}
```

Or, for tabbed indentation:

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

Examples of **incorrect** code for this rule with the `2` option:

<!-- prettier-ignore -->
```html,incorrect
<html>
      <body></body>
</html>
```

Examples of **correct** code for this rule with the `2` option:

```html,correct
<html>
  <body></body>
</html>
```

#### tab

If the option is `"tab"` it enforces tab-based indentation.

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
      "Attribute": 2,
      "tagChildrenIndent": {
        "html": 0,
        "div": 1
        // ...
      }
    }
  ]
}
```

- `Attribute` (default: 1): Specifies the attribute indentation level. e.g. indent of 2 spaces with `Attribute` set to `2` will indent the attributes with `4` spaces (2 x 2).

- `tagChildrenIndent` (default: `{}`): Specifies the indent increment of the child tags of the specified tag. e.g. For example, `"tagChildrenIndent": { "html": 0 }` will set the `<html/>` tag children to 0 indent (2 x 0).

- `ignoreComment` (default: `false`): When set to `true`, the indentation of HTML comments (including opening `<!--`, closing `-->`, and content) will not be checked. This is useful when you want to allow free-form indentation for comments.
