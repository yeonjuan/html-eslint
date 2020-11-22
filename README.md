# html-eslint

## Table of Contents

* [Installation](#Installation)
* [Configuration](#Configuration)
* [Rules](#Rules)
  - [SEO](#SEO)
  - [Accessibility](#Accessibility)

## Installation

```
$ npm install --save-dev eslint @html-eslint/parser @html-eslint/eslint-plugin
```

## Configuration

```js
module.exports = {
  //...
  plugins: ["@html-eslint"],
  overrides: [
    {
      files: ["*.html"],
      parser: "@html-eslint/parser",
      extends: ["@html-eslint/recommended"]
    }
  ]
}
```

## Rules

### SEO

| rule | description | recommended |
| --- | --- | --- | --- |
| [require-lang](/packages/eslint-plugin/docs/rules/require-lang.md) |  | O |

### Accessibility

| rule | description | recommended |
| --- | --- | --- |
| [require-img-alt](/packages/eslint-plugin/docs/rules/require-img-alt.md) |  | O |

