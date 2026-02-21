# no-duplicate-classname

This rule disallows duplicate class names in `className` attributes in React/JSX code.

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
      "@html-eslint/react/no-duplicate-classname": "error",
    },
  },
];
```

## Options

This rule accepts an options object with the following properties:

### `callees`

An array of function names that should be checked for duplicate class names. This is useful for checking utility functions like `clsx`, `cn`, or `classnames`.

```js
{
  "@html-eslint/react/no-duplicate-classname": ["error", {
    "callees": ["clsx", "cn", "classnames"]
  }]
}
```

## Rule Details

This rule enforces unique class names in `className` attribute values by detecting and removing duplicate class names.

When the `callees` option is specified, the rule also checks string arguments passed to the specified functions, including:

- String literals
- Template literals without expressions
- Strings within logical expressions (`&&`, `||`)
- Strings within conditional expressions (ternary operator)

This rule is auto-fixable using the `--fix` option.

## Examples

Examples of **incorrect** code for this rule:

```jsx
// Duplicate class names
<button className="foo foo"></button>
<div className="foo bar foo"></div>

// Works with extra spacing
<button className="foo   foo"></button>

// Works with leading/trailing spaces
<button className=" foo foo bar "></button>

// Also works with JSX expressions containing literals
<div className={"foo foo"}></div>
<div className={`foo bar foo`}></div>

// With callees option
// eslint @html-eslint/react/no-duplicate-classname: ["error", { "callees": ["clsx", "cn"] }]
const classes = clsx("foo foo");
const styles = cn("foo bar foo");
const combined = classnames("foo foo bar"); // ignored - not in callees

// Works with template literals
const classes = clsx(`foo foo`);

// Works with logical expressions
const classes = clsx(condition && "foo foo");

// Works with conditional expressions
const classes = clsx(condition ? "foo foo" : "bar bar");
```

Examples of **correct** code for this rule:

```jsx
// Single class name
<button className="foo"></button>

// Multiple unique class names
<button className="foo bar"></button>
<div className="foo bar baz"></div>

// Similar but different class names
<button className="foo foofoo"></button>

// Empty className
<button className=""></button>

// Missing className value
<button className></button>

// Dynamic className expressions (not checked)
<button className={someVar}></button>
<div className={`foo ${bar} baz`}></div>

// Other attributes are not affected
<button id="foo foo"></button>

// Custom components
<Button className="foo"></Button>

// Custom elements
<custom-element className="foo"></custom-element>

// With callees option
// eslint @html-eslint/react/no-duplicate-classname: ["error", { "callees": ["clsx", "cn"] }]
const classes = clsx("foo bar");
const styles = cn("foo bar baz");

// Function not in callees is ignored
const other = classnames("foo foo");

// Multiple arguments with unique classes
const combined = clsx("foo", bar, "baz");
```

## When Not To Use It

If you don't care about duplicate class names in className attributes, you can disable this rule.

## Further Reading

- [React className](https://react.dev/reference/react-dom/components/common#common-props)
