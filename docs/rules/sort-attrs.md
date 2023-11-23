# sort-attrs

This rule enforces attributes alphabetical sorting.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/sort-attrs": "error",
  },
};
```

## Rule Details

Examples of **incorrect** code for this rule:

```html
<input checked autocomplete="foo" />
```

Examples of **correct** code for this rule:

```html
<input autocomplete="foo" checked />
```

### Options

```ts
//...
"@html-eslint/sort-attrs": ["error", {
  "priority": Array<string>
}]
```

#### priority

This option allows you to set an array of attributes key names.
When `priority` is defined, the specified attributes are sorted to the front with the highest priority.

The default value of `priority` is `["id", "type", "class", "style"]`.

Examples of **incorrect** code for this rule with the default options (`{ "priority": ["id", "type", "class", "style] }`).

```html
<button type="submit" id="foo" style="background:red" class="bar"></button>
```

Examples of **correct** code for this rule with the default options (`{ "priority": ["id", "type", "class", "style] }`).

```html
<button id="foo" type="submit" class="bar" style="background:red"></button>
```

You can also set your own priority if then the default priority will be overwritten.

Examples of **incorrect** code for this rule with the `{ "priority": ["id", "style"] }` option:

```html
<div onclick="foo" style="color:red" id="foo"></div>
```

```html
<div style="color:red" id="foo" onclick="foo"></div>
```

Examples of **correct** code for this rule with the `{ "priority": ["id", "style"] }` option:

```html
<div id="foo" style="color:red" onclick="foo"></div>
```
