# Require `alt` attribute at `img` tag

The `lang` attribute is used to represent the language used in the content.
We can give information to the search engine about the language used in the content.

The screen reader uses `alt` attributes in `img` tag for describing the image.
And the `alt` value is displayed if fails to load the image.
So the `img` tag should contain the `alt` attribute for those who cannot see images.

## Rule Details

This rule enforces the `alt` attribute at `img` tag.

Examples of **incorrect** code for this rule:

```html
<img src="image.png">

<img src="image.png" alt=""> <!-- empty value -->
```

Examples of **correct** code for this rule:

```html
<img src="image.png" alt="some descroption">
```

## Further reading

[MDN - img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
