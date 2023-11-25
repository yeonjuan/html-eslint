# no-inline-styles

This rule disallows the use of inline styles.

## Why?

Using inline styles in HTML is generally considered bad practice for several reasons:

- **Readability and Maintainability**:
  - Inline styles can make the HTML code less readable and harder to maintain, especially as the project grows. It becomes challenging to identify and manage styles applied to different elements when they are scattered throughout the HTML.
- **Reusability**:
  - Inline styles don't promote code reuse. If you want the same style applied to multiple elements, you have to duplicate the inline style for each element. This can lead to redundancy and increases the chances of errors.
- **CSS Specificity Issues**:
  - Inline styles have a high level of specificity, making it harder to override them with external or internal styles. This can lead to unexpected styling behavior and conflicts.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-inline-styles": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<div style="color:#ff0a00"></div>
```

Examples of **correct** code for this rule:

```html,correct
<div class="some-color"></div>
```
