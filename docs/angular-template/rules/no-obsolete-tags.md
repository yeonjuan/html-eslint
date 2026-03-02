---
title: no-obsolete-tags
description: Disallow use of obsolete HTML elements in Angular templates.
---

# no-obsolete-tags

This rule disallows the use of obsolete HTML elements in Angular template files.

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
      "@html-eslint/angular-template/no-obsolete-tags": "error",
    },
  },
];
```

## Rule Details

This rule enforces the avoidance of obsolete HTML elements as defined by the [HTML Living Standard](https://html.spec.whatwg.org/#non-conforming-features).

Obsolete elements include:
`applet`, `acronym`, `bgsound`, `dir`, `frame`, `frameset`, `noframes`, `isindex`, `keygen`, `listing`, `menuitem`, `nextid`, `noembed`, `plaintext`, `rb`, `rtc`, `strike`, `xmp`, `basefont`, `big`, `blink`, `center`, `font`, `marquee`, `multicol`, `nobr`, `spacer`, `tt`

**Note**: Custom elements containing a hyphen (e.g., `<my-font>`, `<custom-center>`) are ignored.

## Examples

Examples of **incorrect** code for this rule:

```html
<!-- Obsolete tags -->
<center>Centered content</center>
<font color="red">Red text</font>
<marquee>Scrolling text</marquee>
<blink>Blinking text</blink>
```

Examples of **correct** code for this rule:

```html
<!-- Modern alternatives -->
<div style="text-align: center">Centered content</div>
<span style="color: red">Red text</span>
<div class="scrolling-text">Scrolling text</div>

<!-- Custom elements are ignored -->
<my-font>Text</my-font>
<custom-center>Content</custom-center>
```

## When Not To Use It

If you need to support legacy HTML for compatibility reasons, you may want to disable this rule.

## Further Reading

- [HTML Living Standard - Non-conforming features](https://html.spec.whatwg.org/#non-conforming-features)
- [MDN - Deprecated and obsolete features](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#deprecated_and_obsolete_elements)
