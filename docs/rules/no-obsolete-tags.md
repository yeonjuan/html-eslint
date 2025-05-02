# no-obsolete-tags

This rule disallows the use of obsolete tags in HTML5.

## Why?

The following elements are obsoleted in HTML5.
These tags are discouraged and should be avoided.

```plaintext
applet, acronym, bgsound, dir, frame, frameset, noframes, isindex, keygen, listing, menuitem, nextid, noembed, plaintext, rb, rtc, strike, xmp, basefont, big, blink, center, font, marquee, multicol, nobr, spacer, tt
```

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-obsolete-tags": "error",
  },
};
```

## Rule Details

This rule disallow using obsolete tags.

Examples of **incorrect** code for this rule:

```html,incorrect
<applet></applet>
<dir></dir>
```

## Further Reading

- [html spec 16.2. Non-conforming features](https://html.spec.whatwg.org/#non-conforming-features)
