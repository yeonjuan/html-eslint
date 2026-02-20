# classname-spacing

This rule disallows extra spacing in `className` attribute values in React/JSX code.

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
      "@html-eslint/react/classname-spacing": "error",
    },
  },
];
```

## Rule Details

This rule enforces proper spacing in `className` attribute values by:

- Disallowing leading whitespace
- Disallowing trailing whitespace
- Disallowing multiple spaces between class names

This rule is auto-fixable using the `--fix` option.

## Examples

Examples of **incorrect** code for this rule:

```jsx
// Leading spaces
<button className=" foo"></button>
<div className="  foo bar"></div>

// Trailing spaces
<button className="foo "></button>
<div className="foo bar  "></div>

// Extra spaces between class names
<button className="foo  bar"></button>
<div className="foo   bar   baz"></div>

// Multiple spacing issues
<div className="  foo  bar  "></div>

// Also works with JSX expressions
<div className={" foo"}></div>
<div className={`foo `}></div>
<div className={`foo  bar`}></div>
```

Examples of **correct** code for this rule:

```jsx
// Single class name
<button className="foo"></button>

// Multiple class names with single spaces
<button className="foo bar"></button>
<div className="foo bar baz"></div>

// Empty className
<button className=""></button>

// Dynamic className expressions (not checked)
<button className={someVar}></button>
<div className={`${prefix}-${suffix}`}></div>

// Other attributes are not affected
<button id=" foo "></button>

// Custom components are ignored
<Button className=" foo "></Button>

// Custom elements are ignored
<custom-element className=" foo "></custom-element>
```

## When Not To Use It

If you don't care about extra spacing in className attributes, you can disable this rule.

## Further Reading

- [React className](https://react.dev/reference/react-dom/components/common#common-props)
