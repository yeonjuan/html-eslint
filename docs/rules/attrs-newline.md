# attrs-newline

This rule enforces a newline between attributes, when more than a certain number of attributes is present.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/attrs-newline": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
```html,incorrect
<p class="foo" data-custom id="p">
  <img class="foo" data-custom />
</p>
```

Examples of **correct** code for this rule:

```html,correct
<p
  class="foo"
  data-custom
  id="p"
>
  <img class="foo" data-custom />
</p>
```

### Options

This rule has an object option:

```ts
//...
"@html-eslint/attrs-newline": ["error", {
  "closeStyle": "sameline" | "newline", // Default `"newline"`
  "ifAttrsMoreThan": number, // Default `2`
}]
```

#### ifAttrsMoreThan

If there are more than this number of attributes, all attributes should be separated by newlines. Either they should _not_ be separated by newlines.

The default is `2`.

Examples of **correct** code for `"ifAttrsMoreThan": 2`

<!-- prettier-ignore -->
```html
<p class="foo" id="p">
  <img
    class="foo"
    data-custom
    id="img"
  />
</p>
```

#### closeStyle

How the open tag's closing bracket `>` should be spaced:

- `"newline"`: The closing bracket should be on a newline following the last attribute:
  <!-- prettier-ignore -->
  ```html
  <img
    class="foo"
    data-custom
    id="img"
  />
  ```

- `"sameline"`: The closing bracket should be on the same line following the last attribute
  <!-- prettier-ignore -->
  ```html
  <img
    class="foo"
    data-custom
    id="img" />
  ```
