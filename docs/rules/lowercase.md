# lowercase

This rule enforces the use of lowercase for tag and attribute names.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/lowercase": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html,incorrect
<Div></Div>
```

<!-- prettier-ignore -->
```html,incorrect
<div ID="foo"></div>
```

<!-- prettier-ignore -->
```html,incorrect
<SCRIPT></SCRIPT>
```

<!-- prettier-ignore -->
```html,incorrect
<sTyle></sTyle>
```

Examples of **correct** code for this rule:

```html,correct
<div></div>
```

```html,correct
<div id="foo"></div>
```

```html,correct
<script></script>
```

```html,correct
<style></style>
```
