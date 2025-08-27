# Getting Started

## Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lint HTML in JavaScript Template Literals](#lint-html-in-javascript-template-literals)
- [Legacy Configuration](#legacy-configuration)
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

Update your configuration file:

```js,eslint.config.js
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
    // lint html files
    {
        files: ["**/*.html"],
        plugins: {
            html,
        },
        // When using the recommended rules
        extends: ["html/recommended"],
        language: "html/html",
        rules: {
            "html/no-duplicate-class": "error",
        }
    }
]);
```

## Lint HTML code inside JavaScript Template Literals

In addition to standalone HTML files, html-eslint also supports linting HTML inside JavaScript and TypeScript template literals, such as:

```js
html`<div class="box">${content}</div>`;
// or
const code = /* html */ `<img class="image" src=${src}/>`;
```

To enable this, you don’t need to set a language. Just apply html-eslint rules to your JavaScript or TypeScript files, and the plugin will detect and lint HTML within template literals.

```js,eslint.config.js
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
    {
        files: ["**/*.js", "**/*.ts"],
        plugins: {
            html,
        },
        rules: {
            "html/require-img-alt": "error",
        },
    },
]);
```

## Legacy Configuration

If you are using ESLint version v8 or earlier, you can configure it as follows.

```js,eslintrc.js
module.exports = {
  //...
  plugins: ["@html-eslint"],
  overrides: [
    {
      files: ["*.html"],
      parser: "@html-eslint/parser",
      extends: ["plugin:@html-eslint/recommended-legacy"],
    },
  ],
};
```

## Editor Configuration

### VSCode

To enable [vscode-eslint](https://github.com/microsoft/vscode-eslint) support in VSCode, add the following to your VSCode settings.

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
