# no-invalid-role

This rule disallows the use of invalid role on elements.

## Why?

This rule checks for the following two cases

1. If a role that doesn't exist in [this list](https://www.w3.org/TR/wai-aria/#roles_categorization) is used

1. If using `role="presentation"` or `role="none"` on certain HTML tags

   - Certain HTML elements have built-in semantic roles that convey important meaning to assistive technologies (e.g., screen readers). Using `role="presentation"` or `role="none"` removes this meaning, making the content harder to interpret for users relying on assistive tools.
   - Interactive elements, such as `<button>`, `<a>`, or `<input>`, are inherently focusable and actionable. Using role="presentation" or role="none" on these elements breaks their expected functionality and prevents users from interacting with them effectively.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-invalid-role": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<button role="presentation"></button>
<div role="foo"></div>
```

Examples of **correct** code for this rule:

```html,correct
<img role="presentation" alt="">
<span role="none"></span>
```
