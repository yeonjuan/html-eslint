<h1 align="center"> HTML ESLint </h1>

<p align="center">
  Monorepo for ESLint plugin which supports linting HTML(HyperText Markup Language) with ESLint.
</p>

<p align="center">
  <img src="https://travis-ci.org/yeonjuan/html-eslint.svg?branch=main" alt="CI Badge" />
</p>

## Table of Contents

1. [Getting Started](#Getting-Started)
   - [Installation](#Installation)
   - [Configuration](#Configuration)
1. [Recommended Configs](#Recommended-Configs)
1. [Rules](#Rules)
1. [License](#License)

## Getting Started

### Installation

```
$ npm install --save-dev eslint @html-eslint/parser @html-eslint/eslint-plugin
```

- Requires Node.js `>=8.10.0`.
- Requires ESLLint `>=6`.

### Configuration

Populate it with the following on your `.eslintrc.js`. If it does not exist create a `.eslintrc.js` config file in the root of your project.

We can apply these [plugin rules](#Rules) to only HTML files(`*.html`) by using `overrides` in `.eslintrc.js`. (see [ESLint Configuration](https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns))

```js
module.exports = {
  //...
  plugins: ["@html-eslint"],
  overrides: [
    {
      files: ["*.html"],
      parser: "@html-eslint/parser",
      extends: ["plugin:@html-eslint/recommended"],
    },
  ],
};
```

## Recommended Configs

This plugin provides `plugin:@html-eslint/recommended`. The recommended configuration contains the rules marked ⭐ in [Rules](#Rules).

## Rules

- 🔧 - Meaning the rule can fix problems aotomatically by running eslint `--fix` options.
- ⭐ - Meaning the rule is recommended.

### Best Practices

| rule                                                                                            | description                                         |       |
| :---------------------------------------------------------------------------------------------- | :-------------------------------------------------- | :---- |
| [@html-eslint/require-doctype](/packages/eslint-plugin/docs/rules/require-doctype.md)           | Enforce to use `<!DOCTYPE HTML>`.                   | ⭐ 🔧 |
| [@html-eslint/no-duplicate-id](/packages/eslint-plugin/docs/rules/no-duplicate-id.md)           | Disallow the duplicated `id`.                       | ⭐    |
| [@html-eslint/no-inline-styles](/packages/eslint-plugin/docs/rules/no-inline-styles.md)         | Disallow using inline styles.                       | ⭐    |
| [@html-eslint/require-li-container](/packages/eslint-plugin/docs/rules/require-li-container.md) | Enforce `<li>` to be in `<ul>`, `<ol>` or `<menu>`. | ⭐    |

### SEO

| rule                                                                                | description                                   |     |
| :---------------------------------------------------------------------------------- | :-------------------------------------------- | :-- |
| [@html-eslint/require-lang](/packages/eslint-plugin/docs/rules/require-lang.md)     | Enforce to use `lang` in `<html>`.            | ⭐  |
| [@html-eslint/require-title](/packages/eslint-plugin/docs/rules/require-title.md)   | Enforce to use `<title><title/>` in `<head>`. | ⭐  |
| [@html-eslint/no-multiple-h1](/packages/eslint-plugin/docs/rules/no-multiple-h1.md) | Disallow using multiple `<h1></h1>`.          |     |

### Accessibility

| rule                                                                                                | description                       |     |
| :-------------------------------------------------------------------------------------------------- | :-------------------------------- | :-- |
| [@html-eslint/require-img-alt](/packages/eslint-plugin/docs/rules/require-img-alt.md)               | Enforce to use `alt` in `<img>`.  | ⭐  |
| [@html-eslint/no-skip-heading-levels](/packages/eslint-plugin/docs/rules/no-skip-heading-levels.md) | Disallow skipping heading levels. |     |

### Styles

| rule                                                                                                | description                                                           |       |
| :-------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- | :---- |
| [@html-eslint/indent](/packages/eslint-plugin/docs/rules/indent.md)                                 | Enforce consistent indentation.                                       | ⭐ 🔧 |
| [@html-eslint/element-newline](/packages/eslint-plugin/docs/rules/element-newline.md)               | Enforce newline between elements.                                     | ⭐ 🔧 |
| [@html-eslint/no-extra-spacing-attrs](/packages/eslint-plugin/docs/rules/no-extra-spacing-attrs.md) | Disallow extra spacing around attributes.                             | ⭐ 🔧 |
| [@html-eslint/quotes](/packages/eslint-plugin/docs/rules/quotes.md)                                 | Enforce consistent quoting attributes with double(`"`) or single(`'`) | ⭐ 🔧 |
| [@html-eslint/id-naming-convention](/packages/eslint-plugin/docs/rules/id-naming-convention.md)     | Enforce consistent naming convention for id attributes                |       |

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.
