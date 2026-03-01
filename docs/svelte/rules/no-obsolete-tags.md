---
title: no-obsolete-tags
description: Disallow obsolete HTML elements that are deprecated in HTML5.
---

# no-obsolete-tags

This rule disallows the use of obsolete tags in HTML5 within Svelte components.

## Why?

The following elements are obsolete in HTML5.
These tags are discouraged and should be avoided.

```plaintext
applet, acronym, bgsound, dir, frame, frameset, noframes, isindex, keygen, listing, menuitem, nextid, noembed, plaintext, rb, rtc, strike, xmp, basefont, big, blink, center, font, marquee, multicol, nobr, spacer, tt
```

## How to use

```js,.eslintrc.js
// eslint.config.js (flat config)
import svelteParser from "svelte-eslint-parser";
import htmlSvelte from "@html-eslint/eslint-plugin-svelte";

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
         "@html-eslint/svelte/no-obsolete-tags": "error",
    },
  },
];
```

## Rule Details

This rule disallows using obsolete tags in Svelte components.

Examples of **incorrect** code for this rule:

```html,incorrect
<center>Centered text</center>

<font color="red">Red text</font>

<div>
  <marquee>Scrolling text</marquee>
</div>
```

Examples of **correct** code for this rule:

```html,correct
<div style="text-align: center">Centered text</div>

<span style="color: red">Red text</span>

<script>
  let count = 0;
</script>

<div>
  <p>{count}</p>
</div>
```

## Further Reading

- [html spec 16.2. Non-conforming features](https://html.spec.whatwg.org/#non-conforming-features)
