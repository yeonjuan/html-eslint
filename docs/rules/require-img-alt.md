# require-img-alt

This rule enforces to use `alt` attribute in `img` tags.

## Why?

- **Accessibility**
  - The primary purpose of the `alt` attribute is to enhance web accessibility. Screen readers and other assistive technologies rely on alternative text to describe images to users with visual impairments. This allows users who cannot see the images to understand the content and context of the images on a webpage.
- **SEO**
  - Search engines use the `alt` text as part of their algorithms to understand the content and context of images. Providing descriptive and relevant alternative text can improve the search engine optimization (SEO) of your website, making it more likely to appear in relevant search results.
- **Broken Image Replacement**
  - If an image fails to load for any reason, the `alt` text is displayed in its place. This helps users understand what the image was supposed to convey, even if they cannot see the actual image.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-img-alt": "error",
  },
};
```

The screen reader uses `alt` attributes in `img` tag for describing the image.
And the `alt` value is displayed if fails to load the image.
So the `img` tag should contain the `alt` attribute for those who cannot see images.

## Rule Details

This rule enforces the `alt` attribute at `img` tag.

Examples of **incorrect** code for this rule:

```html
<img src="image.png" />

<img src="image.png" alt="" />
<!-- empty value -->
```

Examples of **correct** code for this rule:

```html
<img src="image.png" alt="some description" />
```

### Options

This rule takes an object option.

- `substitute`: Specifies an array of attribute keys that can replace the alt attribute.

Examples of **correct** code for the `{ substitute: ["[alt]", "[attr.alt]"] }` option:

```html
<img src="image.png" [alt]="..." />

<img src="image.png" [attr.alt]="..." />
```

## Further Reading

- [MDN - img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
