---
id: all-rules
title: All Rules
---

- 🔧 - Meaning the rule can fix problems aotomatically by running eslint `--fix` options.
- ⭐ - Meaning the rule is recommended.

### Best Pracice

| rule | description |  |
| :--- | :---| :--- |
| [@html-eslint/require-doctype](rules/require-doctype) | Require `<!DOCTYPE HTML>` in html, | ⭐🔧 |
| [@html-eslint/no-duplicate-id](rules/no-duplicate-id) | Disallow to use duplicate id | ⭐ |
| [@html-eslint/no-inline-styles](rules/no-inline-styles) | Disallow using inline style |  |
| [@html-eslint/require-li-container](rules/require-li-container) | Enforce `<li>` to be in  `<ul>`, `<ol>` or `<menu>`. | ⭐ |
| [@html-eslint/no-obsolete-tags](rules/no-obsolete-tags) | Disallow to use obsolete elements in HTML5 | ⭐ |
| [@html-eslint/require-closing-tags](rules/require-closing-tags) | Reqiure closing tags. | ⭐🔧 |
| [@html-eslint/require-meta-charset](rules/require-meta-charset) | Enforce to use `<meta name="chartset">` in `<head>` |  |
| [@html-eslint/no-target-blank](rules/no-target-blank) | Disallow usage of unsafe `target='_blank'` |  |

### SEO

| rule | description |  |
| :--- | :---| :--- |
| [@html-eslint/require-lang](rules/require-lang) | Require `lang` attribute at `<html>` tag | ⭐ |
| [@html-eslint/require-title](rules/require-title) | Require `<title><title/>` in the `<head><head/>` | ⭐ |
| [@html-eslint/no-multiple-h1](rules/no-multiple-h1) | Disallow multiple `<h1></h1>`. | ⭐ |
| [@html-eslint/require-meta-description](rules/require-meta-description) | Require use of `<meta name="description">` in `<head>` |  |

### Accessibility

| rule | description |  |
| :--- | :---| :--- |
| [@html-eslint/require-img-alt](rules/require-img-alt) | Require `alt` attribute at `<img>` tag | ⭐ |
| [@html-eslint/no-skip-heading-levels](rules/no-skip-heading-levels) | Disallow skipping heading levels |  |
| [@html-eslint/require-frame-title](rules/require-frame-title) | Require `title` in `<frame>`, `<iframe>` |  |
| [@html-eslint/no-non-scalable-viewport](rules/no-non-scalable-viewport) | Disallow use of `user-scalable=no` in `<meta name="viewport">`. |  |
| [@html-eslint/no-positive-tabindex](rules/no-positive-tabindex) | Disallow use of positive `tabindex`. |  |
| [@html-eslint/require-meta-viewport](rules/require-meta-viewport) | Enforce to use `<meta name="viewport">` in `<head>` |  |

### Styles

| rule | description |  |
| :--- | :---| :--- |
| [@html-eslint/no-extra-spacing-attrs](rules/no-extra-spacing-attrs) | Disallow an extra spacing around attributes | ⭐🔧 |
| [@html-eslint/element-newline](rules/element-newline) | Enforce newline between elements. | ⭐🔧 |
| [@html-eslint/indent](rules/indent) | Enforce consistent indentation | ⭐🔧 |
| [@html-eslint/quotes](rules/quotes) | Enforce consistent quoting attributes with double(") or single(') | ⭐🔧 |
| [@html-eslint/id-naming-convention](rules/id-naming-convention) | Enforce consistent naming id attributes |  |
