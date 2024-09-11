# element-newline

This rule enforces newlines between tags.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/element-newline": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html,incorrect
<html>
  <head><title>newline</title></head>
</html>
```

Examples of **correct** code for this rule:

```html,correct
<html>
  <head>
    <title>newline</title>
  </head>
</html>
```

### Options

This rule has an object option:

- `"skip"`: skips newline checking for the specified elements` children.
- `"inline"`: instructs the linter that the specified elements can remain on the same line.

```ts
//...
"@html-eslint/element-newline": ["error", {
  "skip": Array<string>
}]
```

#### skip

You can specify list of tag names in the `skip` option.
Newline checking is not performed on children of the specified tags.

Examples of **correct** code for the `{ "skip": ["pre", "code"] }` option:

<!-- prettier-ignore -->
```html
<pre>
    <div></div><div></div>
</pre>
```

<!-- prettier-ignore -->
```html
<code>
    <span></span><div></div>
</code>
```

#### inline

You can specify list of tag names in the `inline` option.
Newlines are not enforced between the specified tags.
As a shortcut, if you include the special value `$inline` in the list then all HTML tags that are usually inline (<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element#inline_text_semantics">as defined by Mozilla</a>) will be included.

Examples of **correct** code for the `{ "inline": ["$inline"] }` option:

<!-- prettier-ignore -->
```html
<div>
    I <strong>like</strong> these <dfn>inline</dfn> tags.
    <p>It's <em>true</em>!</p>
</div>
```
