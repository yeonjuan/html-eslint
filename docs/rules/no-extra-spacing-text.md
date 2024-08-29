# no-extra-spacing-text

This rule disallows multiple consecutive spaces or tabs in text and comments.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-extra-spacing-text": "error",
  },
};
```

## Rule Details

[Whitespace in HTML is largely ignored](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace), so the purpose of this rule is to prevent unnecessary sequences of whitespace in text.

When used with `--fix`, the rule will replace invalid whitespace with a single space.

Note:

- This rule ignores whitespace at the start and end of lines/strings so as not to conflict with indentation rules. See [./indent](@html-eslint/indent).
- This rule does **not** affect whitespace around attributes. See [./no-extra-spacing-attrs](@html-eslint/no-extra-spacing-attrs).

Examples of **incorrect** code for this rule:

```html,incorrect
<div foo   =   "   bar   "   >
  foo     bar
</div>
```

Examples of **correct** code for this rule:

```html,correct
<div foo="bar">
  foo bar
</div>
```

### Options

This rule has an object option:

- `"skip"`: skips whitespace-checking within the specified elements.

```ts
//...
"@html-eslint/element-newline": ["error", {
  "skip": Array<string>
}]
```

#### skip

You can specify a list of tag names in the `skip` option.
Whitespace-checking is not performed on children of the specified tags.

Examples of **correct** code for the `{ "skip": ["pre"] }` option:

<!-- prettier-ignore -->
```html
<div>
  Only short whitespace here.

  <pre>    Any    kind    of   whitespace    here!    </pre>
</div>
```
