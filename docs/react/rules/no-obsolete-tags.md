# no-obsolete-tags

This rule disallows the use of obsolete HTML elements in React/JSX code.

## How to use

```js
// eslint.config.js (flat config)
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      "@html-eslint/react": htmlReact,
    },
    rules: {
      "@html-eslint/react/no-obsolete-tags": "error",
    },
  },
];
```

## Rule Details

This rule disallows the use of obsolete HTML elements that are no longer part of the HTML5 specification. These elements should be replaced with modern alternatives using CSS or semantic HTML.

**Note**: This rule only checks lowercase HTML elements (e.g., `<center>`, `<font>`). PascalCase React components (e.g., `<Center>`) and custom elements with hyphens (e.g., `<my-font>`) are ignored.

## Examples

Examples of **incorrect** code for this rule:

```jsx
// Layout elements - use CSS instead
<center>Centered content</center>
<marquee>Scrolling text</marquee>

// Font styling elements - use CSS instead
<font color="red">Red text</font>
<big>Large text</big>
<tt>Monospace text</tt>

// Frame elements - use iframe or modern alternatives
<frameset cols="25%,75%">
  <frame src="nav.html" />
  <frame src="content.html" />
</frameset>

// Deprecated elements
<applet code="game.class">Java Applet</applet>
<blink>Blinking text</blink>
<strike>Strikethrough text</strike>
<acronym title="World Wide Web">WWW</acronym>
```

Examples of **correct** code for this rule:

```jsx
// Use CSS for centering
<div style={{ textAlign: 'center' }}>Centered content</div>
<div className="center">Centered content</div>

// Use CSS for font styling
<span style={{ color: 'red' }}>Red text</span>
<span style={{ fontSize: 'larger' }}>Large text</span>
<code>Monospace text</code>

// Use iframe for embedding
<iframe src="content.html" title="Content" />

// Use semantic HTML and CSS
<del>Strikethrough text</del>
<abbr title="World Wide Web">WWW</abbr>

// Custom React components are allowed (PascalCase)
<Center>This is a custom component</Center>
<Font color="red">Custom Font component</Font>

// Custom elements are allowed (with hyphens)
<my-center>Custom element</my-center>
<custom-font>Custom web component</custom-font>
```

## React-specific Notes

- **Custom components**: Components with PascalCase names (e.g., `<Center>`, `<Font>`) are treated as React components and ignored by this rule. This allows you to create custom wrapper components with names that match obsolete HTML elements.

- **Custom elements**: Web components with hyphens in their names (e.g., `<my-center>`, `<custom-font>`) are also ignored by this rule.

## Obsolete Elements

The following elements are considered obsolete according to the HTML5 specification:

### Presentational Elements (use CSS instead)

- `<basefont>` - Use CSS font properties
- `<big>` - Use CSS `font-size: larger`
- `<blink>` - Use CSS animations
- `<center>` - Use CSS `text-align: center` or flexbox
- `<font>` - Use CSS font properties
- `<marquee>` - Use CSS animations
- `<nobr>` - Use CSS `white-space: nowrap`
- `<spacer>` - Use CSS margins/padding
- `<tt>` - Use `<code>`, `<kbd>`, or CSS `font-family: monospace`
- `<strike>` - Use `<del>` or `<s>` with CSS

### Frame Elements

- `<frame>` - Use `<iframe>` instead
- `<frameset>` - Use modern layout techniques
- `<noframes>` - No longer needed

### Other Obsolete Elements

- `<acronym>` - Use `<abbr>` instead
- `<applet>` - Use `<object>` or `<embed>` for plugins
- `<bgsound>` - Use `<audio>` element
- `<dir>` - Use `<ul>` instead
- `<isindex>` - Use `<input>` in a `<form>`
- `<keygen>` - No longer supported
- `<listing>` - Use `<pre>` and `<code>`
- `<menuitem>` - Use `<button>` or `<a>` in a menu
- `<multicol>` - Use CSS multi-column layout
- `<nextid>` - No replacement needed
- `<noembed>` - No longer needed
- `<plaintext>` - Use `<pre>` and escape content
- `<rb>` - Ruby base (use `<ruby>` structure)
- `<rtc>` - Ruby text container (use `<ruby>` structure)
- `<xmp>` - Use `<pre>` and escape content

## Modern Alternatives

### Centering Content

```jsx
// ❌ Obsolete
<center>Content</center>

// ✅ Modern CSS
<div style={{ textAlign: 'center' }}>Content</div>
<div className="flex justify-center">Content</div>
```

### Styling Text

```jsx
// ❌ Obsolete
<font color="red" size="5">Text</font>

// ✅ Modern CSS
<span style={{ color: 'red', fontSize: '1.5rem' }}>Text</span>
<span className="text-red-500 text-xl">Text</span>
```

### Abbreviations

```jsx
// ❌ Obsolete
<acronym title="HyperText Markup Language">HTML</acronym>

// ✅ Modern
<abbr title="HyperText Markup Language">HTML</abbr>
```

### Strikethrough

```jsx
// ❌ Obsolete
<strike>Removed text</strike>

// ✅ Modern
<del>Removed text</del>
<s>Incorrect text</s>
```

## Further Reading

- [HTML Spec - Non-conforming features](https://html.spec.whatwg.org/#non-conforming-features)
- [MDN - Obsolete and deprecated elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#obsolete_and_deprecated_elements)
- [React DOM Elements](https://react.dev/reference/react-dom/components/common)
