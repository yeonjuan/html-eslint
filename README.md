# html-eslint

Monorepo for ESLint plugin which supports linting HTML(HyperText Markup Language) with [ESLint](https://github.com/eslint/eslint).

⚠️ This project is experimental until the releasing v1.0.0.

## Table of Contents

- [Installation](#Installation)
- [Configuration](#Configuration)
- [Rules](#Rules)

## Installation

```
$ npm install --save-dev eslint @html-eslint/parser @html-eslint/eslint-plugin
```

## Configuration

Populate it with the following on your `.eslintrc.js`. If it does not exist create a `.eslintrc.js` config file in the root of your project.

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

## Rules

- 🔧 - Meaning the rule can fix problems aotomatically
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

| rule                                                                                                | description                               |       |
| :-------------------------------------------------------------------------------------------------- | :---------------------------------------- | :---- |
| [@html-eslint/indent](/packages/eslint-plugin/docs/rules/indent.md)                                 | Enforce consistent indentation.           | ⭐ 🔧 |
| [@html-eslint/element-newline](/packages/eslint-plugin/docs/rules/element-newline.md)               | Enforce newline between elements.         | ⭐ 🔧 |
| [@html-eslint/no-extra-spacing-attrs](/packages/eslint-plugin/docs/rules/no-extra-spacing-attrs.md) | Disallow extra spacing around attributes. | ⭐ 🔧 |
