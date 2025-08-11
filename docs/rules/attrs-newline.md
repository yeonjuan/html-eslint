# attrs-newline

This rule enforces a newline between attributes when more than a certain number of attributes are present.

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
  "skip": string[], // Default `[]`
  "inline": string[], // Default `[]`
}]
```

#### ifAttrsMoreThan

If there are more than this number of attributes, all attributes should be separated by newlines.

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

#### skip

Tags to skip when applying this rule.

The default is `[]` (empty array).

Examples of **correct** code for `"skip": ["img", "input"]`

<!-- prettier-ignore -->
```html
<img class="foo" data-custom id="img" />
<input type="text" placeholder="Enter text" name="example" />
<p
  class="foo"
  data-custom
  id="p"
>
  Content
</p>
```

#### inline

Tags to treat as inline elements and skip when applying this rule. Supports preset values like `$inline` for common inline HTML elements.

The default is `[]` (empty array).

Examples of **correct** code for `"inline": ["$inline"]`

<!-- prettier-ignore -->
```html
<span class="foo" data-custom id="span">Inline content</span>
<a href="#" class="link" target="_blank">Link text</a>
<div
  class="foo"
  data-custom
  id="div"
>
  Block content
</div>
```

The `$inline` preset includes common inline HTML elements: `a`, `abbr`, `b`, `bdi`, `bdo`, `br`, `cite`, `code`, `data`, `dfn`, `em`, `i`, `kbd`, `mark`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `small`, `span`, `strong`, `sub`, `sup`, `time`, `u`, `var`, `wbr`.
