# sort-attrs

This rule enforces priority-based and alphabetical sorting of attributes.

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

```html,incorrect
<input checked autocomplete="foo" />
```

Examples of **correct** code for this rule:

```html,correct
<input autocomplete="foo" checked />
```

### Options

```ts
//...
"@html-eslint/sort-attrs": ["error", {
  "priority": Array<string | {pattern: string}>
}]
```

#### priority

This option allows you to set an array of attribute names or pattern objects.
When `priority` is defined, the specified attributes are sorted to the front with the highest priority.

Priority items can be:

- Strings: exact attribute name matches
- Objects with `pattern` property: regular expression patterns to match attribute names

The default value of `priority` is `["id", "type", "class", "style"]`.

Examples of **incorrect** code for this rule with the default options (`{ "priority": ["id", "type", "class", "style"] }`).

```html,incorrect
<button type="submit" id="foo" style="background:red" class="bar"></button>
```

Examples of **correct** code for this rule with the default options (`{ "priority": ["id", "type", "class", "style"] }`).

```html,correct
<button id="foo" type="submit" class="bar" style="background:red"></button>
```

You can also define your own priority. If set, it will override the default.

Examples of **incorrect** code for this rule with the `{ "priority": ["id", "style"] }` option:

```html,incorrect
<div onclick="foo" style="color:red" id="foo"></div>
```

```html,incorrect
<div style="color:red" id="foo" onclick="foo"></div>
```

Examples of **correct** code for this rule with the `{ "priority": ["id", "style"] }` option:

```html,correct
<div id="foo" style="color:red" onclick="foo"></div>
```

##### Pattern Support

You can use regular expressions in priority items using the pattern object format:

Examples of **correct** code for this rule with the `{ "priority": ["id", { "pattern": "data-.*" }, "style"] }` option:

```html,correct
<div id="foo" data-test="value" data-custom="attr" style="color:red" onclick="foo"></div>
```

In this example:

- `id` has the highest priority (position 0)
- Any attribute matching `data-.*` pattern has the second priority (position 1)
- `style` has the third priority (position 2)
- All other attributes are sorted alphabetically after the priority items

Examples of **incorrect** code for this rule with the `{ "priority": ["id", { "pattern": "data-.*" }, "style"] }` option:

```html,incorrect
<div style="color:red" data-test="value" id="foo" onclick="foo"></div>
```
