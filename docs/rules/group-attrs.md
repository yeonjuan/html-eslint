# group-attrs

Enforce grouping and ordering of related attributes.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/group-attrs": "error",
  },
};
```

## Rule Details

This rule ensures that related attributes are placed next to each other when multiple attributes from the same group are present on an element. It also ensures that attributes are in the correct order within their group.

If only some attributes from a group are present (partial groups), they are still grouped together. For example, if you have a group `["left", "top", "right", "bottom"]` and only `left` and `top` are present, they should be adjacent to each other.

Examples of **incorrect** code for this rule:

```html
<!-- min and max are separated by type -->
<input min="5" type="text" max="10" />

<!-- width and height are separated by src and alt -->
<img width="100" src="image.jpg" height="200" alt="Image" />

<!-- minlength and maxlength are separated by placeholder -->
<textarea minlength="10" placeholder="Enter text" maxlength="100"></textarea>

<!-- aria-labelledby and aria-describedby are separated by class -->
<div aria-labelledby="label1" class="container" aria-describedby="desc1"></div>

<!-- Partial groups: only some attributes from a group are present, but separated -->
<div left="10" class="box" top="20"></div>

<!-- Multiple attributes from positioning group separated -->
<div left="0" width="100" top="10" height="50" right="100"></div>
```

Examples of **correct** code for this rule:

```html
<!-- Related attributes are grouped together -->
<input min="5" max="10" type="text" />

<!-- Related attributes are grouped together -->
<img width="100" height="200" src="image.jpg" alt="Image" />

<!-- Related attributes are grouped together -->
<textarea minlength="10" maxlength="100" placeholder="Enter text"></textarea>

<!-- Related attributes are grouped together -->
<div aria-labelledby="label1" aria-describedby="desc1" class="container"></div>

<!-- Partial groups: multiple attributes from the same group are together -->
<div left="10" top="20" class="box"></div>

<!-- Multiple positioning attributes grouped together -->
<div left="0" top="10" right="100" width="100" height="50"></div>

<!-- Only one attribute from a group (no violation) -->
<input min="5" type="text" />

<!-- No related attributes present -->
<input type="text" name="example" />
```

### Options

This rule accepts an options object with the following properties:

- `groups`: Array of attribute groups that should be kept together and in order.

```ts
//...
"@html-eslint/group-attrs": ["error", {
  "groups": Array<Array<string>>
}]
```

#### groups

Default:

```js
[
  ["min", "max"],
  ["minlength", "maxlength"],
  ["width", "height"],
  ["aria-labelledby", "aria-describedby"],
  ["data-min", "data-max"],
  ["left", "top", "right", "bottom"],
];
```

Defines arrays of attribute names that should be grouped together when present. Regex patterns are supported, and if an attribute matches multiple patterns, it will only be affected by the first matching pattern.

Example configuration:

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/group-attrs": [
      "error",
      {
        groups: [
          ["min", "max"],
          ["/^data-/"],
          ["x", "y"],
          ["left", "top", "right", "bottom"]
        ]
      }
    ],
  },
};
```

With this configuration:

```html
<!-- ❌ Incorrect: data-start and data-end are separated -->
<div data-start="0" class="slider" data-end="100"></div>

<!-- ✅ Correct: data-start and data-end are grouped -->
<div data-start="0" data-end="100" class="slider"></div>

<!-- ❌ Incorrect: x and y are separated -->
<rect x="10" fill="red" y="20"></rect>

<!-- ✅ Correct: x and y are grouped -->
<rect x="10" y="20" fill="red"></rect>

<!-- ❌ Incorrect: partial group separated (only 3 out of 4 positioning attributes) -->
<div left="0" width="100" top="10" right="100"></div>

<!-- ✅ Correct: partial group together -->
<div left="0" top="10" right="100" width="100"></div>
```

#### Regex Groups and Alphabetical Sorting

If a group is defined as a single regex pattern (for example, ["/^data-/"]), then all attributes matching that pattern will be grouped together and sorted alphabetically. This is useful for grouping and ordering dynamic or custom attributes, such as all `data-*` or `aria-*` attributes.

Example configuration:

```js
module.exports = {
  rules: {
    "@html-eslint/group-attrs": [
      "error",
      {
        groups: [
          ["/^data-/"], // All data-* attributes, sorted alphabetically
          ["/^aria-/"], // All aria-* attributes, sorted alphabetically
        ]
      }
    ],
  },
};
```

With this configuration:

```html
<!-- ❌ Incorrect: data-y comes before data-x alphabetically -->
<input data-y="2" data-x="1">

<!-- ✅ Correct: data-x comes before data-y alphabetically -->
<input data-x="1" data-y="2">

<!-- ❌ Incorrect: aria-label comes before aria-describedby alphabetically -->
<div aria-label="test" aria-describedby="desc"></div>

<!-- ✅ Correct: aria-describedby comes before aria-label alphabetically -->
<div aria-describedby="desc" aria-label="test"></div>
```

#### Multiple Items in a Group

If a group contains multiple items (for example, ["type", "/^data-/"]), the set of attributes matching each regex will not be sorted alphabetically.

Example configuration:

```js
module.exports = {
  rules: {
    "@html-eslint/group-attrs": [
      "error",
      {
        groups: [
          ["type", "/^data-/"], // 'type' first, then all data-* attributes (not alphabetically sorted)
          ["/^aria-/", "/^aria-/"] // group all aria-* attributes, without sorting
        ]
      }
    ],
  },
};
```

With this configuration:

```html
<!-- ❌ Incorrect: data-x comes before type -->
<input data-x="1" type="text" data-y="2">

<!-- ✅ Correct: type comes before data-x and data-y -->
<input type="text" data-x="1" data-y="2">

<!-- ✅ Correct: type comes before data-y and data-x -->
<input type="text" data-y="2" data-x="1">

<!-- ✅ Correct: aria-describedby comes before aria-label -->
<div aria-describedby="desc" aria-label="test"></div>

<!-- ✅ Correct: aria-label comes before aria-describedby -->
<div aria-label="test" aria-describedby="desc"></div>
```

## When Not To Use It

You might want to disable this rule if:

- You have `@html-eslint/sort-attrs` enabled
- You have specific semantic groupings that don't align with the default groups
