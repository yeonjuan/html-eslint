# require-explicit-size

This rule enforces that some elements (img, iframe) have explicitly defined width and height attributes.

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

```html,incorrect
<img src="/my-image.png" width="400" height="300">
<iframe src="/page" width="400" height="300"></iframe>
```

### Options

This rule has an object option:

- `"allowClass"`: List of classes to allow even if no size is specified
- `"allowId"`: List of IDs to allow even if size is not specified

```ts
"@html-eslint/element-newline": ["error", {
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
