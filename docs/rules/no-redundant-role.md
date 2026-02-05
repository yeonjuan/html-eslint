# no-redundant-role

This rule disallows redundant role attributes that match the element's implicit role.

## Why?

Many HTML elements have implicit ARIA roles. Explicitly specifying a role attribute with the same value as the element's implicit role is redundant and adds unnecessary code.

For example, a `<button>` element already has an implicit role of `button`, so adding `role="button"` is redundant.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-redundant-role": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html,incorrect
<button role="button">Click me</button>
<nav role="navigation">Navigation</nav>
<main role="main">Main content</main>
<a href="/" role="link">Home</a>
<article role="article">Article content</article>
<aside role="complementary">Sidebar</aside>
<h1 role="heading">Title</h1>
<ul role="list">
  <li>Item</li>
</ul>
<input type="checkbox" role="checkbox">
<textarea role="textbox"></textarea>
```

Examples of **correct** code for this rule:

```html,correct
<button>Click me</button>
<nav>Navigation</nav>
<main>Main content</main>
<a href="/">Home</a>

<!-- Role that differs from implicit role -->
<button role="link">Link styled as button</button>
<nav role="tablist">Tab navigation</nav>

<!-- Elements without implicit roles -->
<div role="button">Custom button</div>
<span role="navigation">Navigation</span>
```
