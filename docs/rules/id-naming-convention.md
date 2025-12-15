# id-naming-convention

This rule enforces a consistent naming convention for `id` attribute values.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/id-naming-convention": "error",
  },
};
```

## Rule Details

This rule supports four naming conventions. `camelCase`, `snake_case`, `PascalCase`, `kebab-case` (default `snake_case`). It also supports `regex`, which allows you to define a custom naming convention.

### Options

- `"snake_case"` (default): Enforce snake_case format.
- `"camelCase"`: Enforce camelCase format.
- `"PascalCase"`: Enforce PascalCase format.
- `"kebab-case"`: Enforce kebab-case format.
- `"regex", { "pattern": "^my-regex$", "flags": "i" }`: Enforce a format defined by a custom regex. The `flags` option is optional.

#### "snake_case" (default)

Examples of **incorrect** code for this rule with the default `"snake_case"` option:

```html,incorrect
<div id="Foo"></div>
```

Examples of **correct** code for this rule with the default `"snake_case"` option:

```html,correct
<div id="foo_bar"></div>
```

#### "camelCase"

Examples of **incorrect** code for this rule with the `"camelCase"` option:

```html,incorrect
<div id="foo_bar"></div>
```

Examples of **correct** code for this rule with the `"camelCase"` option:

```html,correct
<div id="fooBar"></div>
```

#### "PascalCase"

Examples of **incorrect** code for this rule with the `"PascalCase"` option:

```html,incorrect
<div id="foo_bar"></div>
```

Examples of **correct** code for this rule with the `"PascalCase"` option:

```html,correct
<div id="FooBar"></div>
```

#### "kebab-case"

Examples of **incorrect** code for this rule with the `"kebab-case"` option:

```html,incorrect
<div id="foo_bar"></div>
```

Examples of **correct** code for this rule with the `"kebab-case"` option:

```html,correct
<div id="foo-bar"></div>
```

#### "regex"

Examples of **incorrect** code for this rule with the `"regex"` option below:

```js
{
  "@html-eslint/id-naming-convention": ["error", "regex", { "pattern": "^([A-Z][a-z])+[A-Z]?$" }]
}
```

```html,incorrect
<div id="foo_bar"></div>
```

Examples of **correct** code for this rule with the `"regex"` option below:

```js
{
  "@html-eslint/id-naming-convention": ["error", "regex", { "pattern": "^([A-Z][a-z])+[A-Z]?$" }]
}
```

```html,correct
<div id="CuStOmReGeX"></div>
```

## Further Reading

[Wiki - Naming convention](<https://en.wikipedia.org/wiki/Naming_convention_(programming)>)
