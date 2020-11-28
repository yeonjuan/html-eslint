# Enforce consistent indentation

## Rule Details

This rule enforces consistent indentation styles. The default indent is `4spaces`.

## Options

This rule has two options

- `number(0, 1, ..)` (default 4): requires the use of indentation with specified number of spaces.

- `"tab"`: requires the use of indentation with tab (`\t`).

Examples of **incorrect** code for this rule:

<!-- prettier-ignore-start -->
```html
<html>
<body>
</body>
</html>
```
<!-- prettier-ignore-end -->

Examples of **correct** code for this rule:

<!-- prettier-ignore-start -->
```html
<html>
    <body>
    </body>
</html>
```
<!-- prettier-ignore-end -->

## Options

### space

If the option is number it means the number of spaces for indentation.

```json
{
  "indent": ["error", 2]
}
```

Examples of **incorrect** code for this rule with the `"2"` option:

<!-- prettier-ignore-start -->
```html
<html>
    <body>
    </body>
</html>
```
<!-- prettier-ignore-end -->

Examples of **correct** code for this rule with the `"2"` option:

<!-- prettier-ignore-start -->
```html
<html>
  <body>
  </body>
</html>
```
<!-- prettier-ignore-end -->

### tab

If the option is `""tab` it means using `tab` for indentation.

```json
{
  "indent": ["error", "tab"]
}
```

Examples of **incorrect** code for this rule:

<!-- prettier-ignore-start -->
```html
<html>
  <body>
  </body>
</html>
```
<!-- prettier-ignore-end -->

Examples of **correct** code for this rule:

<!-- prettier-ignore-start -->
```html
<html>
    <body> <!-- tab -->
    </body> <!-- tab -->
</html>
```
<!-- prettier-ignore-end -->
