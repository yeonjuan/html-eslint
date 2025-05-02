# max-element-depth

This rule enforces a maximum allowed depth for nested HTML elements.

## Why?

Deeply nested HTML structures are harder to read and understand, making the code more difficult to maintain. Flatter structures are more intuitive for developers, reducing the likelihood of errors and improving team collaboration.

Deep nesting also increases rendering complexity for browsers. The browser’s layout engine must compute styles and positions for every element, and excessive nesting can slow this down — especially on resource-constrained devices.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/max-element-depth": "error",
  },
};
```

## Rule Details

### Options

This rule has an object option:

- `"max"`: Maximum element depth to allow.

```ts
"@html-eslint/element-newline": ["error", {
  "max": number
}]
```

Examples of **incorrect** code for this rule with the `{"max": 2}` option:

```html,incorrect
<div>
    <div>
        <div>
        </div>
    </div>
</div>
```

Examples of **correct** code for this rule with the `{"max": 2}` option:

```html,correct
<div>
    <div>
    </div>
</div>
```

## Further Reading

- [Avoid an excessive DOM size](https://developer.chrome.com/docs/lighthouse/performance/dom-size)
