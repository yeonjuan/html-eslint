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
```html
<html>
  <head><title>newline</title></head>
</html>
```

Examples of **correct** code for this rule:

```html
<html>
  <head>
    <title>newline</title>
  </head>
</html>
```

### Options

This rule has an object option:

- `"skip"`: skips newline checking for the specified element's children.

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
