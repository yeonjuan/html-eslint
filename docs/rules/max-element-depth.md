# max-element-depth

This rule enforces element maximum depth.

## Why?

Deeply nested HTML structures can be difficult to read and understand, making the code harder to maintain. A flatter structure is more intuitive for developers, reducing the likelihood of errors and improving collaboration.

Deep nesting can increase the complexity of rendering for browsers. The browser's layout engine needs to compute styles and positions for all elements, and deeply nested structures can slow down this process, especially on resource-constrained devices.

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
