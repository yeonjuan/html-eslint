---
title: svelte/require-attrs
description: Require specified attributes on elements in Svelte components.
---

# require-attrs

This rule enforces the use of elements with specified attributes in Svelte components.

## How to use

```js
// eslint.config.js (flat config)
import htmlSvelte from "@html-eslint/eslint-plugin-svelte";
import * as svelteParser from "svelte-eslint-parser";

export default [
  {
    files: ["**/*.svelte"],
    plugins: {
      "@html-eslint/svelte": htmlSvelte,
    },
    languageOptions: {
      parser: svelteParser,
    },
    rules: {
      "@html-eslint/svelte/require-attrs": [
        "error",
        { tag: "img", attr: "alt" },
      ],
    },
  },
];
```

## Rule Details

This rule requires specified attributes to be present on matching elements.

Attributes that cannot be resolved statically are not reported. When an element has a spread attribute (`{...props}`), the check is skipped unless the attribute is written after the last spread, since a spread can add or override attributes at runtime:

```svelte
<img {...props} />        <!-- skipped: props may provide alt -->
<img alt="" {...props} /> <!-- skipped: props may override alt -->
<img {...props} alt="" /> <!-- checked: alt wins over props -->
```

### Options

This rule takes an array of option objects:

- `tag` (`string`, **required**): the HTML tag name to check.
- `attr` (`string`, **required**): the attribute name that must be present.
- `value` (`string`, _optional_): if specified, the attribute must have this exact value.
- `message` (`string`, _optional_): custom error message.
- `conditions` (`array`, _optional_): conditions that must all be true before the attribute is enforced.

Examples of **incorrect** code for this rule:

```html,incorrect
<img />
<svg></svg>
```

Examples of **correct** code for this rule:

```html,correct
<img alt="" />
<svg viewBox="0 0 100 100"></svg>
```
