---
id: no-obsolete-tags
title: "no-obsolete-tags"
---

# no-obsolete-tags

Disallow using obsolete tags in HTML5

The following element list is obsoleted in HTML5.
It's not encouraged to use these tags.

```
applet, acronym, bgsound, dir, frame, frameset, noframes, isindex, keygen, listing, menuitem, nextid, noembed, plaintext, rb, rtc, strike, xmp, basefont, big, blink, center, font, marquee, multicol, nobr, spacer, tt
```

## How to use

.eslintrc.js

```js
module.exports = {
  rules: {
    "@html-eslint/no-obsolete-tags": "error",
  },
};
```

## Rule Details

This rule disallow using obsolete tags.

Examples of **incorrect** code for this rule:

```html
<applet></applet>
<dir></dir>
```

## Further reading

- [html spec 16.2. Non-conforming features](https://html.spec.whatwg.org/#non-conforming-features)
