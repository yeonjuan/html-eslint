# html-eslint

> An ESLint plugin for HTML and HTML-like syntax (React JSX).

html-eslint is an eslint-plugin that allows developers to lint HTML and HTML-like syntax. Whether you are working with standard HTML, HTML-in-JS libraries like Lit, React JSX/TSX, or various template engines, html-eslint helps enforce consistent formatting, accessibility, and best practices across your markup.

---

## Resources

- **Documentation**: https://html-eslint.org/docs/getting-started
- **HTML Rules**: https://html-eslint.org/docs/rules
- **React Rules**: https://html-eslint.org/docs/react/rules
- **Playground**: https://html-eslint.org/playground
- **GitHub**: https://github.com/yeonjuan/html-eslint
- **npm (html)**: https://www.npmjs.com/package/@html-eslint/eslint-plugin
- **npm (react)**: https://www.npmjs.com/package/@html-eslint/eslint-plugin-react

## 1. For HTML and HTML in JS (Lit)

If you need to lint standard `.html` files or are using libraries like `Lit`, you should use the `@html-eslint/eslint-plugin` package.

### Basic Setup

#### 1. Install the dependencies

```bash
npm install --save-dev eslint @html-eslint/parser @html-eslint/eslint-plugin
```

#### 2. Configure

Set up your ESLint configuration file (e.g., eslint.config.js) to use the HTML parser and plugin.

```javascript
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
    // lint html files
    {
        files: ["**/*.html"],
        plugins: {
            html,
        },
        language: "html/html",
        rules: {
            "html/no-duplicate-class": "error",
        }
    }
]);
```

#### Helpful Links

- Getting Started / Detailed Usage: https://html-eslint.org/docs/getting-started
- All Available HTML Rules: https://html-eslint.org/docs/rules

#### Template Engine Support
html-eslint also provides support for popular template engines like Handlebars, ERB, Twig, and more.

- Integrating Template Engines: https://html-eslint.org/docs/integrating-template-engine

## 2. For React
If you are building React applications, html-eslint provides dedicated rules specifically tailored for React environments via the `@html-eslint/eslint-plugin-react` package.

### Basic Setup

#### 1. Install the dependency:

```bash
npm install --save-dev eslint @html-eslint/eslint-plugin-react
```

#### 2. Configure:
Update your configuration file to include the React-specific plugin and recommended rules.

```javascript
import htmlReact from "@html-eslint/eslint-plugin-react";

export default [
  {
    files: ["**/*.jsx", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@html-eslint/react": htmlReact,
    },
    rules: {
      "@html-eslint/react/no-invalid-attr-value": "error",
      "@html-eslint/react/use-baseline": "error",
    },
  },
];
```

#### Helpful Links
- React Getting Started / Detailed Usage: https://html-eslint.org/docs/react/getting-started

- All Available React Rules: https://html-eslint.org/docs/react/rules
