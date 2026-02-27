# use-baseline

Enforce the use of baseline web platform features.

This rule checks whether HTML elements and attributes are baseline features according to the [web-features](https://github.com/web-platform-dx/web-features) specification. It helps ensure browser compatibility by warning about features that may not be widely supported.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/svelte/use-baseline": "error",
  },
};
```

## Options

This rule has an object option:

- `available`: (default: `"widely"`) - Specifies the baseline availability level
  - `"widely"`: Features that are widely available (default)
  - `"newly"`: Features that are newly available
  - `number`: A specific year (e.g., 2017, 2019) for baseline features

### Examples

#### Default (widely available)

```js
{
  "@html-eslint/svelte/use-baseline": "error"
}
```

#### Newly available features

```js
{
  "@html-eslint/svelte/use-baseline": ["error", { "available": "newly" }]
}
```

#### Specific year

```js
{
  "@html-eslint/svelte/use-baseline": ["error", { "available": 2019 }]
}
```

## Rule Details

This rule reports HTML elements and attributes that are not baseline features according to the specified availability level.

**Note:** Svelte components (PascalCase or kebab-case with dashes like `<CustomComponent>` or `<my-component>`) are automatically skipped by this rule.

Examples of **incorrect** code for this rule:

```svelte
<template shadowrootmode="open"></template>
```

```svelte
<div contenteditable="plaintext-only"></div>
```

```svelte
<input type="week" />
```

Examples of **correct** code for this rule:

```svelte
<div id="foo"></div>
```

```svelte
<input type="number" />
```

```svelte
<CustomComponent popovertarget="mypopover"></CustomComponent>
```
