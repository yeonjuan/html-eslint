# class-spacing

This rule disallows extra spacing in `class` attribute values in Svelte code.

## How to use

```js
// eslint.config.js (flat config)
import htmlSvelte from "@html-eslint/eslint-plugin-svelte";

export default [
  {
    files: ["**/*.svelte"],
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    rules: {
      "@html-eslint/svelte/class-spacing": "error",
    },
  },
];
```

## Rule Details

This rule enforces proper spacing in `class` attribute values by:

- Disallowing leading whitespace
- Disallowing trailing whitespace
- Disallowing multiple spaces between class names

This rule only checks fully static `class` attributes. Attributes with dynamic expressions (e.g., `class="foo {bar}"`) are not checked by this rule.

This rule is auto-fixable using the `--fix` option.

## Examples

Examples of **incorrect** code for this rule:

```svelte
<!-- Leading spaces -->
<button class=" foo"></button>
<div class="  foo bar"></div>

<!-- Trailing spaces -->
<button class="foo "></button>
<div class="foo bar  "></div>

<!-- Extra spaces between class names -->
<button class="foo  bar"></button>
<div class="foo   bar   baz"></div>

<!-- Multiple spacing issues -->
<div class="  foo  bar  "></div>
```

Examples of **correct** code for this rule:

```svelte
<!-- Single class name -->
<button class="foo"></button>

<!-- Multiple class names with single spaces -->
<button class="foo bar"></button>
<div class="foo bar baz"></div>

<!-- Empty class -->
<button class=""></button>

<!-- Dynamic class expressions (not checked) -->
<button class="foo {someVar}"></button>
<div class="foo {active ? 'active' : ''}"></div>

<!-- Other attributes are not affected -->
<button id=" foo "></button>

<!-- Custom components are checked -->
<Button class=" foo "></Button>

<!-- Custom elements are checked -->
<custom-element class=" foo "></custom-element>
```

## When Not To Use It

If you don't care about extra spacing in class attributes, you can disable this rule.

## Further Reading

- [Svelte class directive](https://svelte.dev/docs/svelte/class)
