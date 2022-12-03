---
id: require-li-container
title: "require-li-container"
---

# require-li-container

## Enforce `<li>` to be in `<ul>`, `<ol>` or `<menu>`.

The `<li>` tag should be contained in a parent element: `<ol>`, `<ul>` or `<menu>`.

### Rule Details

Examples of **incorrect** code for this rule:

```html
<div>
  <li>item 1</li>
  <li>item 2</li>
</div>
```

Examples of **correct** code for this rule:

```html
<ol>
  <li>item 1</li>
  <li>item 2</li>
</ol>

<ul>
  <li>item 1</li>
  <li>item 2</li>
</ul>
```

## Further reading

[MDN - li](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)
