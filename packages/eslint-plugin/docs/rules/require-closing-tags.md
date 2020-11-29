# Require consistent use of closing tag.

## Rule Details

This rule enforces use of closing tag.

## Options

## selfClosing : "never"

```json
{
  "@html-eslint/require-closing-tags": [
    "error",
    {
      "selfClosing": "never"
    }
  ]
}
```

Examples of **incorrect** code for this rule:

<!-- prettier-ignore-start -->
```html
<div> foo
<img />
```
<!-- prettier-ignore-end -->

Examples of **correct** code for this rule:

```html
<div>no closing tag</div>
<img />
```

## selfClosing : "always"

```json
{
  "@html-eslint/require-closing-tags": [
    "error",
    {
      "selfClosing": "always"
    }
  ]
}
```

Examples of **incorrect** code for this rule:

<!-- prettier-ignore-start -->
```html
<div> foo
<img>
```
<!-- prettier-ignore-end -->

Examples of **correct** code for this rule:

```html
<div>foo</div>
<img />
```

## Further reading
