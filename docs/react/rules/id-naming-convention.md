---
title: react/id-naming-convention
description: Enforce consistent naming convention for id attributes in React/JSX.
---

# id-naming-convention

This rule enforces a consistent naming convention for `id` attribute values.

## How to use

```js
// eslint.config.js (flat config)
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      "@html-eslint/react": htmlReact,
    },
    rules: {
      "@html-eslint/react/id-naming-convention": "error",
    },
  },
];
```

## Rule Details

This rule supports four naming conventions. `camelCase`, `snake_case`, `PascalCase`, `kebab-case` (default `snake_case`). It also supports `regex`, which allows you to define a custom naming convention.

### Options

- `"snake_case"` (default): Enforce snake_case format.
- `"camelCase"`: Enforce camelCase format.
- `"PascalCase"`: Enforce PascalCase format.
- `"kebab-case"`: Enforce kebab-case format.
- `"regex", { "pattern": "^my-regex$", "flags": "i" }`: Enforce a format defined by a custom regex. The `flags` option is optional.

## Examples

Examples of **incorrect** code for this rule with the default `"snake_case"` option:

```jsx,incorrect
<div id="Foo"></div>
```

Examples of **correct** code for this rule with the default `"snake_case"` option:

```jsx,correct
<div id="foo_bar"></div>
```

**Note**: An `id` whose value is a dynamic JSX expression (e.g. `<div id={dynamicId}></div>`) can't be statically verified, so it is ignored.

## Further Reading

[Wiki - Naming convention](<https://en.wikipedia.org/wiki/Naming_convention_(programming)>)
