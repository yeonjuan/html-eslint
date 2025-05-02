# require-attrs

This rule enforces the use of tags with specified attributes.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-attrs": [
      "error",
      {
        tag: "svg",
        attr: "viewBox",
      },
    ],
  },
};
```

## Rule Details

### Options

This rule takes an array of objects which has tag name with attribute name.

```js
module.exports = {
  rules: {
    "@html-eslint/require-attrs": [
      "error",
      {
        tag: "img",
        attr: "alt", // Enforce to use img with alt attribute.
      },
      {
        tag: "svg",
        attr: "viewBox" // Enforce to use svg and viewBox attributes with "0 0 100 100" value.
        value: "0 0 100 100"
      },
    ],
  },
};
```

Examples of **incorrect** code for this rule with the option below:

```json
{
  "tag": "img",
  "attr": "alt"
},
{
  "tag": "svg",
  "attr": "viewBox",
  "value": "0 0 100 100"
}
```

```html,incorrect
<img /> <svg></svg>
```

Examples of **correct** code for this rule with the option above:

```html,correct
<img alt="" /><svg viewBox="0 0 100 100"></svg>
```
