# Using HTML ESLint with Other HTML-processing Plugins

## Overview

HTML ESLint focuses on linting HTML syntax and structure. However, you may also want to lint JavaScript code within HTML files (such as inline `<script>` tags) or use other ESLint plugins that process HTML files. This guide explains how to configure HTML ESLint alongside other plugins.

## Linting JavaScript Inside HTML

HTML ESLint does not lint JavaScript code within HTML files. To lint JavaScript in HTML (such as inline scripts), you can use [eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html).

### Why Separate Configuration Files?

When using both HTML ESLint and eslint-plugin-html, **you need separate configuration files**. This is because:

1. HTML ESLint uses a custom parser (`@html-eslint/parser`) that understands HTML syntax
2. eslint-plugin-html uses a different approach to extract and lint JavaScript from HTML
3. When both are configured for the same `*.html` files in a single config, ESLint may try to apply JavaScript rules to HTML syntax, causing errors

This limitation is due to how ESLint's parser system works and is not specific to HTML ESLint. For more context, see:

- [ESLint Discussion #18808](https://github.com/eslint/eslint/discussions/18808)
- [ESLint Issue #14286](https://github.com/eslint/eslint/issues/14286)
- [ESLint Issue #17655](https://github.com/eslint/eslint/issues/17655)

### Configuration Example

#### Step 1: Create a Configuration for HTML ESLint

Create `eslint-html.config.mjs` for HTML syntax linting:

```js
import html from "@html-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.html"],
    plugins: {
      html,
    },
    extends: ["html/recommended"],
    language: "html/html",
    rules: {
      // Customize HTML linting rules
      "html/indent": ["error", 2],
    },
  },
];
```

#### Step 2: Create a Configuration for JavaScript in HTML

Create `eslint.config.mjs` for JavaScript linting within HTML:

```js
import js from "@eslint/js";
import htmlPlugin from "eslint-plugin-html";

export default [
  {
    files: ["**/*.html"],
    plugins: {
      html: htmlPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      // Customize JavaScript rules for inline scripts
      "no-unused-vars": "error",
      "prefer-const": "error",
    },
  },
];
```

#### Step 3: Run ESLint with Each Configuration

Run ESLint separately with each configuration file:

```bash
# Lint HTML syntax
npx eslint --config eslint-html.config.mjs "**/*.html"

# Lint JavaScript in HTML
npx eslint --config eslint.config.mjs "**/*.html"
```

### Using npm Scripts

You can simplify this workflow by adding scripts to your `package.json`:

```json
{
  "scripts": {
    "lint:html": "eslint --config eslint-html.config.mjs \"**/*.html\"",
    "lint:js-in-html": "eslint --config eslint.config.mjs \"**/*.html\"",
    "lint": "npm run lint:html && npm run lint:js-in-html"
  }
}
```

Then run:

```bash
npm run lint
```

## Complete Working Example

Here's a complete example with all necessary files:

### Installation

```bash
npm install --save-dev eslint @html-eslint/eslint-plugin @html-eslint/parser eslint-plugin-html @eslint/js
```

### HTML File (`example.html`)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Example</title>
    <script>
      let message = "Hello World";
      console.log(message);
    </script>
  </head>
  <body>
    <p>Welcome!</p>
  </body>
</html>
```

### HTML ESLint Configuration (`eslint-html.config.mjs`)

```js
import html from "@html-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.html"],
    plugins: {
      html,
    },
    extends: ["html/recommended"],
    language: "html/html",
    rules: {
      "html/require-doctype": "error",
      "html/no-duplicate-id": "error",
    },
  },
];
```

### JavaScript in HTML Configuration (`eslint.config.mjs`)

```js
import js from "@eslint/js";
import htmlPlugin from "eslint-plugin-html";

export default [
  {
    files: ["**/*.html"],
    plugins: {
      html: htmlPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "error",
      "prefer-const": "error",
    },
  },
];
```

### Package.json Scripts

```json
{
  "scripts": {
    "lint:html": "eslint --config eslint-html.config.mjs \"**/*.html\"",
    "lint:js": "eslint --config eslint.config.mjs \"**/*.html\"",
    "lint": "npm run lint:html && npm run lint:js"
  }
}
```

## Alternative Approaches

### Separate HTML and JS Files

If possible, consider separating your JavaScript into `.js` files and referencing them in HTML:

```html
<script src="script.js"></script>
```

This allows you to:

- Use a single ESLint configuration
- Lint `.html` files with HTML ESLint
- Lint `.js` files with standard JavaScript rules

### CI/CD Integration

When integrating with CI/CD, run both linting commands:

```yaml
# Example GitHub Actions workflow
- name: Lint HTML syntax
  run: npx eslint --config eslint-html.config.mjs "**/*.html"

- name: Lint JavaScript in HTML
  run: npx eslint --config eslint.config.mjs "**/*.html"
```

## Troubleshooting

### Error: "Cannot read properties of undefined"

If you see errors like `Cannot read properties of undefined (reading 'ignorePatternRegExp')` when trying to use both plugins in one config, this confirms you need separate configuration files.

### JavaScript Rules Applied to HTML

If you see JavaScript linting errors on HTML tags, ensure:

1. You're using the correct config file for each purpose
2. The `files` pattern matches appropriately
3. You haven't mixed both parsers in the same configuration object

## Related Documentation

- [Getting Started](./getting-started.md)
- [FAQ](./faq.md)
- [Integrating Template Engines](./integrating-template-engine.md)
