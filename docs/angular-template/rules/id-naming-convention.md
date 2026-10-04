---
title: angular-template/id-naming-convention
description: Enforce consistent naming convention for id attributes in Angular templates.
---

# id-naming-convention

This rule enforces a consistent naming convention for `id` attribute values.

## How to use

```js
// eslint.config.js (flat config)
import angularTemplate from "@html-eslint/eslint-plugin-angular-template";
import templateParser from "@angular-eslint/template-parser";

export default [
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: templateParser,
    },
    plugins: {
      "@html-eslint/angular-template": angularTemplate,
    },
    rules: {
      "@html-eslint/angular-template/id-naming-convention": "error",
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

```html,incorrect
<div id="Foo"></div>
```

Examples of **correct** code for this rule with the default `"snake_case"` option:

```html,correct
<div id="foo_bar"></div>
```

**Note**: An `id` whose value is a bound attribute (e.g. `<div [id]="dynamicId"></div>`), or an element on a custom element (names containing `-`), can't be statically verified, so it is ignored.

## Further Reading

[Wiki - Naming convention](<https://en.wikipedia.org/wiki/Naming_convention_(programming)>)
