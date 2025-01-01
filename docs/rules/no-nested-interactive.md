# no-nested-interactive

This rule disallows interactive elements from being nested

## Why?

- Screen readers and other assistive technologies may struggle to interpret nested interactive elements correctly. This can confuse users who rely on these tools, making the interface less accessible.

- Interactive elements like `<button>`, `<a>`, or `<form>` are designed with specific, independent purposes. Nesting them can result in conflicting functionality, making it unclear what action will be performed when a user interacts with the element.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-nested-interactive": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<button><iframe src="https:..."></iframe></button>

<a href="/foo"> <button>Click Me</button> </a>
```

Examples of **correct** code for this rule:

```html,correct
<label> text: <input type="text"> </label>
<div><button>click me</button></div>
```
