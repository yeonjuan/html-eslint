# Getting Started

## Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Flat config](#flat-config)
  - [eslintrc config (.eslintrc.\*)](#eslintrc-config-eslintrc)
  - [Using ESlint Language](#using-eslint-language)
- [Lint HTML in JavaScript Template Literal](#lint-html-in-javascript-template-literals)
- [Editor Configuration](#editor-configuration)
- [Comparison with eslint-plugin-jsx-a11y](#accessibility-comparison-with-eslint-plugin-jsx-a11y)

## Prerequisites

- Node.js: `^12.22.0 || ^14.17.0 || >=16.0.0`.
- ESLint: `>=6`.

## Installation

- npm

```console,Terminal
npm install --save-dev eslint @html-eslint/parser @html-eslint/eslint-plugin
```

- yarn

```console,Terminal
yarn add -D eslint @html-eslint/parser @html-eslint/eslint-plugin
```

## Configuration

### Flat config

If you are using the ESLint [Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), see examples below.

#### Minimal configuration

```js,eslint.config.js
import html from "@html-eslint/eslint-plugin";

export default [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
  },
];
```

or if using `require(..);`

```js,eslint.config.js
const html = require("@html-eslint/eslint-plugin");

module.exports = [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ... html.configs["flat/recommended"],
    files: ["**/*.html"],
  },
];
```

#### Recommended rules with some customization

```js,eslint.config.js
import html from "@html-eslint/eslint-plugin";

export default [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    rules: {
      ...html.configs["flat/recommended"].rules, // Must be defined. If not, all recommended rules will be lost
      "@html-eslint/indent": "error",
    },
  },
];
```

or if using `require(..);`

```js,eslint.config.js
const html = require("@html-eslint/eslint-plugin");

module.exports = [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    rules: {
      ...html.configs["flat/recommended"].rules, // Must be defined. If not, all recommended rules will be lost
      "@html-eslint/indent": "error",
    },
  },
];
```

#### Explicit plugin and parser configuration

```js,eslint.config.js
import html from "@html-eslint/eslint-plugin";
import htmlParser from "@html-eslint/parser";

export default [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    plugins: {
      "@html-eslint": html,
    },
    languageOptions: {
      parser: htmlParser,
    },
  },
];
```

or if using `require(..);`

```js,eslint.config.js
const html = require("@html-eslint/eslint-plugin");
const htmlParser = require("@html-eslint/parser");

module.exports = [
  // your own configurations.
  {
    // recommended configuration included in the plugin
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    plugins: {
      "@html-eslint": html,
    },
    languageOptions: {
      parser: htmlParser,
    },
  },
];
```

### eslintrc config (.eslintrc.\*)

Populate it with the following on your `.eslintrc.js`. If it does not exist create a `.eslintrc.js` config file in the root of your project.
We can apply [HTML-ESLint plugin rules](rules) to only HTML files(`*.html`) by using `overrides` in `.eslintrc.js`. (see [ESLint Configuration](https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns))

```js,.eslintrc.js
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

### Using ESlint Language

Starting from ESLint v9.7.0, you can use [Language](https://eslint.org/docs/latest/extend/languages).

```js,eslint.config.js
const html = require("@html-eslint/eslint-plugin");

module.exports = [
  // your own configurations.
  {
    files: ["**/*.html"],
    plugins: {
      html,
    },
    language: "html/html",
    rules: {
      // rules
    }
  }
];
```

## Lint HTML in JavaScript Template Literals

This plugin allows you to lint not only HTML files but also HTML written in [JavaScript Template Literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).
You can set the [@html-eslint rules](./rules.md) in your settings to lint JavaScript code without any additional configuration.

```js,eslint.config.js
import eslintHTML from "@html-eslint/eslint-plugin";
export default [
  // You can use the @html-eslint rules in your ESLint configuration for JS!
  // This is used to lint HTML written inside Template Literal.
  "plugins": {
    "@html-eslint": eslintHTML
  },
  "rules": {
    // Specifies the @html-eslint rules to apply to Template Literal.
    "@html-eslint/no-inline-styles": 1,
    "@html-eslint/indent": 1,
  }
];
```

Not all template literals are recognized as HTML.
There are two ways to make the plugin recognize them as HTML.

```js
// 1. Tagged Templates with a function named `html`
html` <div style="${style}"></div>`;

// 2. Template Literal after a html comment (/* html */)
const code = /* html */ `<div style="${style}"></div>`;
```

If you want to use keywords other than `html` for linting, you can configure the `settings` option.

```js
 {
    "plugins": {
      "@html-eslint": eslintHTML
    },
    settings: {
        html: {
          templateLiterals: {
               // default options
               tags: ["^html$"],
               comments: ["^\\s*html\\s*$"],
          }
        }
    },
}
```

## Editor Configuration

### VSCode

To enable [vscode-eslint](https://github.com/microsoft/vscode-eslint) support, add the following to your VSCode settings.

```json,.vscode/settings.json
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript", // ...
    "html" // Add "html" to enable linting `.html` files.
  ]
}
```

## Accessibility comparison with `eslint-plugin-jsx-a11y`

If you're using this plugin along with [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y), here's a mapping of equivalent rules:

<!-- For some reason, it trims the .md extension from external links, so we will add it twice. -->
| Old Name | New Name | Old Status | New Status |
|----------|----------|------------|------------|
| [`accessible-emoji`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/accessible-emoji.md.md) |  | ⚠️ | ❌ |
| [`alt-text`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/alt-text.md.md) | [`require-img-alt`](rules/require-img-alt.md) | ⭐ | ⭐ |
| [`anchor-ambiguous-text`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-ambiguous-text.md.md) |  | ⭐ | ❌ |
| [`anchor-has-content`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-has-content.md.md) |  | ⭐ | ❌ |
| [`anchor-is-valid`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-is-valid.md.md) |  | ⭐ | ❌ |
| [`aria-activedescendant-has-tabindex`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-activedescendant-has-tabindex.md.md) |  | ⭐ | ❌ |
| [`aria-props`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-props.md.md) | [`no-invalid-role`](rules/no-invalid-role.md) | ⭐ | ⭐ |
| [`aria-proptypes`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-proptypes.md.md) | [`no-invalid-role`](rules/no-invalid-role.md) | ⭐ | ⭐ |
| [`aria-role`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-role.md.md) | [`no-abstract-roles`](rules/no-abstract-roles.md) | ⭐ | ⭐ |
| [`aria-unsupported-elements`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-unsupported-elements.md.md) | [`no-invalid-role`](rules/no-invalid-role.md) | ⭐ | ⭐ |
| [`autocomplete-valid`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/autocomplete-valid.md.md) |  | ⭐ | ❌ |
| [`click-events-have-key-events`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/click-events-have-key-events.md.md) |  | ⭐ | ❌ |
| [`control-has-associated-label`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/control-has-associated-label.md.md) | [`require-input-label`](rules/require-input-label.md) | ⭐ | ⭐ |
| [`heading-has-content`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/heading-has-content.md.md) | [`no-empty-headings`](rules/no-empty-headings.md) | ⭐ | ⭐ |
| [`html-has-lang`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/html-has-lang.md.md) | [`require-lang`](rules/require-lang.md) | ⭐ | ⭐ |
| [`iframe-has-title`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/iframe-has-title.md.md) | [`require-frame-title`](rules/require-frame-title.md) | ⭐ | ⭐ |
| [`img-redundant-alt`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/img-redundant-alt.md.md) |  | ⭐ | ❌ |
| [`interactive-supports-focus`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/interactive-supports-focus.md.md) |  | ⭐ | ❌ |
| [`label-has-associated-control`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md.md) | [`require-input-label`](rules/require-input-label.md) | ⭐ | ⭐ |
| [`label-has-for`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-for.md.md) | [`require-input-label`](rules/require-input-label.md) | ⚠️ | ⭐ |
| [`lang`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/lang.md.md) | [`require-lang`](rules/require-lang.md) | ⭐ | ⭐ |
| [`media-has-caption`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/media-has-caption.md.md) |  | ⭐ | ❌ |
| [`mouse-events-have-key-events`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/mouse-events-have-key-events.md.md) |  | ⭐ | ❌ |
| [`no-access-key`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-access-key.md.md) | [`no-accesskey-attrs`](rules/no-accesskey-attrs.md) | ⭐ | ⭐ |
| [`no-aria-hidden-on-focusable`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-aria-hidden-on-focusable.md.md) | [`no-aria-hidden-on-focusable`](rules/no-aria-hidden-on-focusable.md) | ⭐ | ⭐ |
| [`no-autofocus`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-autofocus.md.md) |  | ⭐ | ❌ |
| [`no-distracting-elements`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-distracting-elements.md.md) |  | ⭐ | ❌ |
| [`no-interactive-element-to-noninteractive-role`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-interactive-element-to-noninteractive-role.md) |  | ⭐ | ❌ |
| [`no-noninteractive-element-interactions`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-noninteractive-element-interactions.md.md) | [`no-nested-interactive`](rules/no-nested-interactive.md) | ⭐ | ⭐ |
| [`no-noninteractive-element-to-interactive-role`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-noninteractive-element-to-interactive-role.md.md) |  | ⭐ | ❌ |
| [`no-noninteractive-tabindex`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-noninteractive-tabindex.md.md) | [`no-positive-tabindex`](rules/no-positive-tabindex.md) | ⭐ | ⭐ |
| [`no-onchange`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-onchange.md.md) |  | ⚠️ | ❌ |
| [`no-redundant-roles`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-redundant-roles.md.md) |  | ⭐ | ❌ |
| [`no-static-element-interactions`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-static-element-interactions.md.md) | [`no-nested-interactive`](rules/no-nested-interactive.md) | ⭐ | ⭐ |
| [`prefer-tag-over-role`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/prefer-tag-over-role.md.md) |  | ⭐ | ❌ |
| [`role-has-required-aria-props`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/role-has-required-aria-props.md.md) |  | ⭐ | ❌ |
| [`role-supports-aria-props`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/role-supports-aria-props.md.md) |  | ⭐ | ❌ |
| [`scope`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/scope.md.md) |  | ⭐ | ❌ |
| [`tabindex-no-positive`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/tabindex-no-positive.md.md) | [`no-positive-tabindex`](rules/no-positive-tabindex.md) | ⭐ | ⭐ |

### Status Legend

- 🔧 **Fully supported** - Rule is supported, and has an auto-fix
- ⭐ **Supported** - Rule is supported but doesn't have an auto-fix  
- ❌ **Not supported** - No equivalent rule
- ⚠️ **Warning** - Rule is deprecated in eslint-plugin-jsx-a11y
