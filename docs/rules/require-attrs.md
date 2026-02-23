---
title: require-attrs
description: Require specified attributes on elements based on custom configuration.
---
# require-attrs

This rule enforces the use of tags with specified attributes.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-attrs": [
      "error",
      {
        tag: "svg",
        attr: "viewBox",
      },
    ],
  },
};
```

## Rule Details

### Options

This rule takes an array of option objects:

```js
module.exports = {
  rules: {
    "@html-eslint/require-attrs": [
      "error",
      {
        tag: "img",
        attr: "alt",
      },
      {
        tag: "svg",
        attr: "viewBox",
        value: "0 0 100 100",
      },
    ],
  },
};
```

#### tag

- Type: `string`
- **Required**

The HTML tag name to check for the specified attribute.

#### attr

- Type: `string`
- **Required**

The attribute name that must be present on the specified tag.

#### value

- Type: `string`
- _Optional_

The expected value for the attribute. If specified, the attribute must have this exact value.

#### message

- Type: `string`
- _Optional_

Custom error message to display when the rule is violated. If not provided, a default message will be used.

```js
module.exports = {
  rules: {
    "@html-eslint/require-attrs": [
      "error",
      {
        tag: "img",
        attr: "alt",
        message: "Images must have alternative text for accessibility",
      },
    ],
  },
};
```

Examples of **incorrect** code for this rule:

```html
<!-- Missing alt attribute -->
<img />

<!-- Missing viewBox attribute -->
<svg></svg>

<!-- Wrong viewBox value -->
<svg viewBox="wrong"></svg>
```

Examples of **correct** code for this rule:

```html
<!-- Has required alt attribute -->
<img alt="" />

<!-- Has required viewBox attribute -->
<svg viewBox="0 0 100 100"></svg>

<!-- Correct viewBox value -->
<svg viewBox="0 0 100 100"></svg>
```
