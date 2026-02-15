It might be valuable to make `html-eslint` rules reusable not only for plain HTML files but also for frameworks (React, Vue, Angular) and template engines (e.g., Handlebars, EJS, Pug).

The idea is to separate the core HTML checking logic into a `@html-eslint/core` package, and then provide adapters like `@html-eslint/react`, `@html-eslint/vue`, `@html-eslint/angular,` or `@html-eslint/handlebars`. Each adapter would parse its syntax and run the shared rules through the core engine.

This could bring consistent HTML linting (attributes, accessibility, best practices, SEO/security checks) across plain HTML, JSX/TSX, Vue SFCs, Angular templates, and popular templating engines.

---

## Framework Coverage Analysis

### React

| html-eslint Rule              | Status      | Existing React Solution                                                                                                                                                              |
| ----------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `require-img-alt`             | ❌ Covered  | [jsx-a11y/alt-text](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/alt-text.md)                                                                           |
| `no-accesskey-attrs`          | ❌ Covered  | [jsx-a11y/no-access-key](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-access-key.md)                                                                 |
| `no-aria-hidden-body`         | ❌ Covered  | [jsx-a11y/aria-role](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-role.md)                                                                         |
| `no-aria-hidden-on-focusable` | ❌ Covered  | [jsx-a11y/no-aria-hidden-on-focusable](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-aria-hidden-on-focusable.md)                                     |
| `no-abstract-roles`           | ❌ Covered  | [jsx-a11y/aria-role](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-role.md)                                                                         |
| `no-invalid-role`             | ❌ Covered  | [jsx-a11y/aria-role](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/aria-role.md)                                                                         |
| `no-redundant-role`           | ❌ Covered  | [jsx-a11y/no-redundant-roles](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-redundant-roles.md)                                                       |
| `no-heading-inside-button`    | ❌ Covered  | [jsx-a11y/heading-has-content](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/heading-has-content.md)                                                     |
| `no-nested-interactive`       | ❌ Covered  | [jsx-a11y/no-interactive-element-to-noninteractive-role](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-interactive-element-to-noninteractive-role.md) |
| `no-target-blank`             | ❌ Covered  | [react/jsx-no-target-blank](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md)                                                         |
| `require-button-type`         | ❌ Covered  | [react/button-has-type](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/button-has-type.md)                                                                 |
| `no-invalid-attr-value`       | ⚠️ Partial  | [react/no-invalid-html-attribute](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-invalid-html-attribute.md) (only validates `rel` by default)           |
| `require-closing-tags`        | ⚠️ Partial  | [react/void-dom-elements-no-children](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md) (void elements only)                |
| `no-invalid-entity`           | ❌ Covered  | [react/no-unescaped-entities](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md)                                                     |
| `no-obsolete-tags`            | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-obsolete-attrs`           | ⚠️ Partial  | [react/no-unknown-property](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md) (detects unknown props, not HTML5 obsolete attrs)       |
| `no-duplicate-id`             | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-duplicate-attrs`          | ❌ Covered  | [react/jsx-no-duplicate-props](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md)                                                   |
| `no-multiple-h1`              | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-skip-heading-levels`      | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-frame-title`         | ❌ Covered  | [react/iframe-missing-sandbox](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/iframe-missing-sandbox.md) (sandbox, not title)                              |
| `require-lang`                | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-meta-charset`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-meta-viewport`       | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-meta-description`    | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-title`               | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-doctype`             | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-non-scalable-viewport`    | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `prefer-https`                | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-inline-styles`            | ⚠️ Partial  | [react/style-prop-object](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md) (validates style prop is object, not prohibition)           |
| `lowercase`                   | ⚠️ Partial  | JSX uses camelCase                                                                                                                                                                   |
| `no-empty-headings`           | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-input-label`         | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-positive-tabindex`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-form-method`         | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-li-container`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-duplicate-in-head`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-duplicate-class`          | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-ineffective-attrs`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-open-graph-protocol` | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-explicit-size`       | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `use-baseline`                | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-restricted-attrs`         | ⚠️ Partial  | [react/forbid-dom-props](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/forbid-dom-props.md) (can forbid props on DOM elements)                            |
| `no-restricted-attr-values`   | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-restricted-tags`          | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-script-style-type`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-whitespace-only-children` | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-attrs`               | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `css-no-empty-blocks`         | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `max-element-depth`           | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `attrs-newline`               | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `element-newline`             | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `quotes`                      | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `sort-attrs`                  | ⚠️ Optional | Formatting preference                                                                                                                                                                |
| `class-spacing`               | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `id-naming-convention`        | ⚠️ Optional | Formatting preference                                                                                                                                                                |
| `indent`                      | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `no-extra-spacing-attrs`      | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `no-extra-spacing-text`       | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `no-multiple-empty-lines`     | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `no-trailing-spaces`          | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |

### Vue

| html-eslint Rule              | Status      | Existing Vue Solution                                                                      |
| ----------------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `require-img-alt`             | ❌ Covered  | [vue/require-img-alt](https://eslint.vuejs.org/rules/require-img-alt.html)                 |
| `no-duplicate-attrs`          | ❌ Covered  | [vue/no-duplicate-attributes](https://eslint.vuejs.org/rules/no-duplicate-attributes.html) |
| `require-button-type`         | ❌ Covered  | [vue/require-button-type](https://eslint.vuejs.org/rules/require-button-type.html)         |
| `no-multiple-h1`              | ❌ Covered  | [vue/no-multiple-h1](https://eslint.vuejs.org/rules/no-multiple-h1.html)                   |
| `no-invalid-attr-value`       | ✅ Needed   | No equivalent                                                                              |
| `no-obsolete-tags`            | ✅ Needed   | No equivalent                                                                              |
| `no-obsolete-attrs`           | ✅ Needed   | No equivalent                                                                              |
| `no-duplicate-id`             | ✅ Needed   | No equivalent                                                                              |
| `no-skip-heading-levels`      | ✅ Needed   | No equivalent                                                                              |
| `require-lang`                | ✅ Needed   | No equivalent                                                                              |
| `require-meta-charset`        | ✅ Needed   | No equivalent                                                                              |
| `require-meta-viewport`       | ✅ Needed   | No equivalent                                                                              |
| `require-meta-description`    | ✅ Needed   | No equivalent                                                                              |
| `require-title`               | ✅ Needed   | No equivalent                                                                              |
| `require-doctype`             | ✅ Needed   | No equivalent                                                                              |
| `no-non-scalable-viewport`    | ✅ Needed   | No equivalent                                                                              |
| `prefer-https`                | ✅ Needed   | No equivalent                                                                              |
| `no-accesskey-attrs`          | ✅ Needed   | No equivalent                                                                              |
| `no-aria-hidden-body`         | ✅ Needed   | No equivalent                                                                              |
| `no-aria-hidden-on-focusable` | ✅ Needed   | No equivalent                                                                              |
| `no-abstract-roles`           | ✅ Needed   | No equivalent                                                                              |
| `no-invalid-role`             | ✅ Needed   | No equivalent                                                                              |
| `no-redundant-role`           | ✅ Needed   | No equivalent                                                                              |
| `no-nested-interactive`       | ✅ Needed   | No equivalent                                                                              |
| `no-target-blank`             | ✅ Needed   | No equivalent                                                                              |
| `no-empty-headings`           | ✅ Needed   | No equivalent                                                                              |
| `require-input-label`         | ✅ Needed   | No equivalent                                                                              |
| `require-frame-title`         | ✅ Needed   | No equivalent                                                                              |
| `no-positive-tabindex`        | ✅ Needed   | No equivalent                                                                              |
| `require-form-method`         | ✅ Needed   | No equivalent                                                                              |
| `require-li-container`        | ✅ Needed   | No equivalent                                                                              |
| `no-duplicate-in-head`        | ✅ Needed   | No equivalent                                                                              |
| `no-duplicate-class`          | ✅ Needed   | No equivalent                                                                              |
| `require-closing-tags`        | ✅ Needed   | No equivalent                                                                              |
| `no-invalid-entity`           | ✅ Needed   | No equivalent                                                                              |
| `no-ineffective-attrs`        | ✅ Needed   | No equivalent                                                                              |
| `require-open-graph-protocol` | ✅ Needed   | No equivalent                                                                              |
| `require-explicit-size`       | ✅ Needed   | No equivalent                                                                              |
| `use-baseline`                | ✅ Needed   | No equivalent                                                                              |
| `no-restricted-attrs`         | ✅ Needed   | No equivalent                                                                              |
| `no-restricted-attr-values`   | ✅ Needed   | No equivalent                                                                              |
| `no-restricted-tags`          | ✅ Needed   | No equivalent                                                                              |
| `no-script-style-type`        | ✅ Needed   | No equivalent                                                                              |
| `no-whitespace-only-children` | ✅ Needed   | No equivalent                                                                              |
| `require-attrs`               | ✅ Needed   | No equivalent                                                                              |
| `css-no-empty-blocks`         | ✅ Needed   | No equivalent                                                                              |
| `max-element-depth`           | ✅ Needed   | No equivalent                                                                              |
| `no-inline-styles`            | ✅ Needed   | No equivalent                                                                              |
| `attrs-newline`               | ⚠️ Optional | Formatting (Prettier)                                                                      |
| `element-newline`             | ⚠️ Optional | Formatting (Prettier)                                                                      |
| `quotes`                      | ⚠️ Optional | Formatting (Prettier)                                                                      |
| `sort-attrs`                  | ⚠️ Optional | Formatting preference                                                                      |
| `class-spacing`               | ⚠️ Optional | Formatting (Prettier)                                                                      |
| `id-naming-convention`        | ⚠️ Optional | Formatting preference                                                                      |
| `indent`                      | ⚠️ Optional | Formatting (Prettier)                                                                      |
| `lowercase`                   | ⚠️ Optional | Formatting (Prettier)                                                                      |
| `no-extra-spacing-attrs`      | ⚠️ Optional | Formatting (Prettier)                                                                      |
| `no-extra-spacing-text`       | ⚠️ Optional | Formatting (Prettier)                                                                      |
| `no-multiple-empty-lines`     | ⚠️ Optional | Formatting (Prettier)                                                                      |
| `no-trailing-spaces`          | ⚠️ Optional | Formatting (Prettier)                                                                      |

### Angular

| html-eslint Rule              | Status      | Existing Angular Solution                                                                                                                                                            |
| ----------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `require-img-alt`             | ❌ Covered  | [@angular-eslint/template/alt-text](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/alt-text.md)                               |
| `no-duplicate-attrs`          | ❌ Covered  | [@angular-eslint/template/no-duplicate-attributes](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/no-duplicate-attributes.md) |
| `require-button-type`         | ❌ Covered  | [@angular-eslint/template/button-has-type](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/button-has-type.md)                 |
| `no-invalid-attr-value`       | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-obsolete-tags`            | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-obsolete-attrs`           | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-duplicate-id`             | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-multiple-h1`              | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-skip-heading-levels`      | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-lang`                | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-meta-charset`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-meta-viewport`       | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-meta-description`    | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-title`               | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-doctype`             | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-non-scalable-viewport`    | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `prefer-https`                | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-accesskey-attrs`          | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-aria-hidden-body`         | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-aria-hidden-on-focusable` | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-abstract-roles`           | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-invalid-role`             | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-redundant-role`           | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-nested-interactive`       | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-target-blank`             | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-empty-headings`           | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-input-label`         | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-frame-title`         | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-positive-tabindex`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-form-method`         | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-li-container`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-duplicate-in-head`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-duplicate-class`          | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-closing-tags`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-invalid-entity`           | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-ineffective-attrs`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-open-graph-protocol` | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-explicit-size`       | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `use-baseline`                | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-restricted-attrs`         | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-restricted-attr-values`   | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-restricted-tags`          | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-script-style-type`        | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-whitespace-only-children` | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `require-attrs`               | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `css-no-empty-blocks`         | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `max-element-depth`           | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `no-inline-styles`            | ✅ Needed   | No equivalent                                                                                                                                                                        |
| `attrs-newline`               | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `element-newline`             | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `quotes`                      | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `class-spacing`               | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `id-naming-convention`        | ⚠️ Optional | Formatting preference                                                                                                                                                                |
| `indent`                      | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `lowercase`                   | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `no-extra-spacing-attrs`      | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `no-extra-spacing-text`       | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `no-multiple-empty-lines`     | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `no-trailing-spaces`          | ⚠️ Optional | Formatting (Prettier)                                                                                                                                                                |
| `sort-attrs`                  | ⚠️ Optional | Formatting preference                                                                                                                                                                |

### Svelte

| html-eslint Rule              | Status      | Existing Svelte Solution                                                                         |
| ----------------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `require-img-alt`             | ❌ Covered  | [svelte/valid-img-alt](https://sveltejs.github.io/eslint-plugin-svelte/rules/valid-img-alt/)     |
| `no-target-blank`             | ❌ Covered  | [svelte/no-target-blank](https://sveltejs.github.io/eslint-plugin-svelte/rules/no-target-blank/) |
| `no-invalid-attr-value`       | ✅ Needed   | No equivalent                                                                                    |
| `no-obsolete-tags`            | ✅ Needed   | No equivalent                                                                                    |
| `no-obsolete-attrs`           | ✅ Needed   | No equivalent                                                                                    |
| `no-duplicate-id`             | ✅ Needed   | No equivalent                                                                                    |
| `no-duplicate-attrs`          | ✅ Needed   | No equivalent                                                                                    |
| `no-multiple-h1`              | ✅ Needed   | No equivalent                                                                                    |
| `no-skip-heading-levels`      | ✅ Needed   | No equivalent                                                                                    |
| `require-button-type`         | ✅ Needed   | No equivalent                                                                                    |
| `require-lang`                | ✅ Needed   | No equivalent                                                                                    |
| `require-meta-charset`        | ✅ Needed   | No equivalent                                                                                    |
| `require-meta-viewport`       | ✅ Needed   | No equivalent                                                                                    |
| `require-meta-description`    | ✅ Needed   | No equivalent                                                                                    |
| `require-title`               | ✅ Needed   | No equivalent                                                                                    |
| `require-doctype`             | ✅ Needed   | No equivalent                                                                                    |
| `no-non-scalable-viewport`    | ✅ Needed   | No equivalent                                                                                    |
| `prefer-https`                | ✅ Needed   | No equivalent                                                                                    |
| `no-accesskey-attrs`          | ✅ Needed   | No equivalent                                                                                    |
| `no-aria-hidden-body`         | ✅ Needed   | No equivalent                                                                                    |
| `no-aria-hidden-on-focusable` | ✅ Needed   | No equivalent                                                                                    |
| `no-abstract-roles`           | ✅ Needed   | No equivalent                                                                                    |
| `no-invalid-role`             | ✅ Needed   | No equivalent                                                                                    |
| `no-redundant-role`           | ✅ Needed   | No equivalent                                                                                    |
| `no-nested-interactive`       | ✅ Needed   | No equivalent                                                                                    |
| `no-inline-styles`            | ✅ Needed   | No equivalent                                                                                    |
| `attrs-newline`               | ⚠️ Optional | Formatting (Prettier)                                                                            |
| `element-newline`             | ⚠️ Optional | Formatting (Prettier)                                                                            |
| `quotes`                      | ⚠️ Optional | Formatting (Prettier)                                                                            |

---

## Summary

### Legend

- ✅ **Needed**: Rule would be valuable, no existing equivalent
- ❌ **Covered**: Already covered by framework-specific plugins
- ⚠️ **Optional**: Formatting/style rules (often handled by Prettier)

### Key Findings

1. **Accessibility Rules**: React has comprehensive coverage through `jsx-a11y`, but Vue, Angular, and Svelte lack many accessibility rules
2. **HTML Standards**:
   - React has `no-invalid-html-attribute` but only validates `rel` attribute by default
   - React has `no-unknown-property` for detecting unknown DOM properties (JSX-focused, not HTML5 obsolete attrs)
   - Most frameworks still lack comprehensive HTML standards validation
3. **SEO/Meta Tags**: No framework has comprehensive meta tag validation
4. **Document Structure**: Rules for doctype, lang, title are missing across all frameworks
5. **Formatting Rules**: Most teams use Prettier, making these rules optional
6. **React-specific Findings**:
   - Props/Attributes: `jsx-no-duplicate-props` covers duplicate attribute detection
   - Button validation: `button-has-type` requires type attribute
   - Entity validation: `no-unescaped-entities` covers HTML entity validation in JSX
   - Self-closing tags: `void-dom-elements-no-children` prevents children in void elements
   - Iframe security: `iframe-missing-sandbox` validates sandbox (not title)
   - Style validation: `style-prop-object` ensures style prop is object (doesn't prohibit inline styles)
   - Restricted props: `forbid-dom-props` can restrict specific props on DOM elements

### High-Value Rules for Framework Adoption

These rules would provide the most value across frameworks:

- `no-invalid-attr-value` - HTML attribute validation
- `no-obsolete-tags` / `no-obsolete-attrs` - HTML standards compliance
- `require-meta-*` rules - SEO optimization
- `no-skip-heading-levels` - Document structure/a11y
- `no-duplicate-id` - HTML validity
- `prefer-https` - Security best practice
