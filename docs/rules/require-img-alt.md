---
id: require-img-alt
title: "@html-eslint/require-img-alt"
---

## Require `alt` attribute at `img` tag

The screen reader uses `alt` attributes in `img` tag for describing the image.
And the `alt` value is displayed if fails to load the image.
So the `img` tag should contain the `alt` attribute for those who cannot see images.

### Rule Details

This rule enforces the `alt` attribute at `img` tag.

Examples of **incorrect** code for this rule:

```html
<img src="image.png" />

<img src="image.png" alt="" />
<!-- empty value -->
```

Examples of **correct** code for this rule:

```html
<img src="image.png" alt="some descroption" />
```

### Further reading

[MDN - img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
