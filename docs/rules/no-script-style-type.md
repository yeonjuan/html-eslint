# no-script-style-type

This rule disallows the use of `type` attributes for style sheets (unless not using CSS) and scripts (unless not using JavaScript).

## Why?

Specifying below tag's `type` attributes is not necessary as HTML5 implies `text/css` and `text/javascript` as defaults

- script - `type="text/javascript"`
- style, link - `type="text/css"`

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-script-style-type": "error",
  },
};
```

## Rule Details

This rule disallows the use of `type` attributes for style sheets (unless not using CSS) and scripts (unless not using JavaScript).

Examples of **incorrect** code for this rule:

```html,incorrect
<script type="text/javascript" src="https://script.js"></script>
```

```html,incorrect
<link type="text/css" rel="stylesheet" href="https://styles.css" />
```

```html,incorrect
<style type="text/css"></style>
```

Examples of **correct** code for this rule:

```html,correct
<script src="https://script.js"></script>
```

```html,correct
<script type="module" src="https://script.js"></script>
```

```html,correct
<link rel="stylesheet" href="https://styles.css" />
```

```html,correct
<style></style>
```

## Further Reading

- [Google HTML/CSS Style Guide - type Attributes](https://google.github.io/styleguide/htmlcssguide.html#type_Attributes)
