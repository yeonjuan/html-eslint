---
title: require-explicit-size
description: Require explicit width and height attributes on img and iframe elements.
---

# require-explicit-size

This rule enforces that certain elements such as `img` and `iframe`, have explicitly defined width and height attributes.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-explicit-size": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<img src="/my-image.png">
<iframe src="/page"></iframe>
```

Examples of **correct** code for this rule:

```html,correct
<img src="/my-image.png" width="400" height="300">
<iframe src="/page" width="400" height="300"></iframe>
```

### Options

This rule has an object option:

- `"allowClass"`: An array of class names. If an element has one of these classes, it will be exempt from this rule.
- `"allowId"`: An array of IDs. If an element has one of these IDs, it will be exempt from this rule.

```ts
"@html-eslint/require-explicit-size": ["error", {
  "allowClass": string[];
  "allowId": string[];
}]
```

Examples of **correct** code for the `{ "allowClass": ["foo"], "allowId": ["bar"] }` option:

```html,correct
<img class="foo">
<iframe id="bar"></iframe>
```

## Further Reading

- [smashingmagazine - Setting Height And Width On Images Is Important Again](https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/)
