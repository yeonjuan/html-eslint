---
id: id-naming-convention
title: "id-naming-convention"
---

# id-naming-convention

Enforce naming conventions for id attributes.

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/id-naming-convention": "error",
  },
};
```

## Rule Details

This rule enforces naming conventions for id attributes.
It supports 4 naming cases. `camelCase`, `snake_case`, `PascalCase`, `kebab-case` (default `snake_case`).

### Options

- `"snake_case"` (default): Enforce snake_case format.
- `"camelCase"`: Enforce camelCase format.
- `"PascalCase"`: Enforce PascalCase format.
- `"kebab-case"`: Enforce kebab-case format.

#### "snake_case" (default)

Examples of **incorrect** code for this rule with the default `"snake_case"` option:

```html
<div id="Foo"></div>
```

Examples of **correct** code for this rule with the default `"snake_case"` option:

```html
<div id="foo_bar"></div>
```

#### "camelCase"

Examples of **incorrect** code for this rule with the `"camelCase"` option:

```html
<div id="foo_bar"></div>
```

Examples of **correct** code for this rule with the `"camelCase"` option:

```html
<div id="fooBar"></div>
```

#### "PascalCase"

Examples of **incorrect** code for this rule with the `"PascalCase"` option:

```html
<div id="foo_bar"></div>
```

Examples of **correct** code for this rule with the `"PascalCase"` option:

```html
<div id="FooBar"></div>
```

### "kebab-case"

Examples of **incorrect** code for this rule with the `"kebab-case"` option:

```html
<div id="foo_bar"></div>
```

Examples of **correct** code for this rule with the `"kebab-case"` option:

```html
<div id="foo-bar"></div>
```

## Further reading

[Wiki - Naming convention](<https://en.wikipedia.org/wiki/Naming_convention_(programming)>)
