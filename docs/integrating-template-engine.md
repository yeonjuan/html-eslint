---
title: Integrating Template Engine
description: Learn how to integrate HTML ESLint with template engines like Handlebars, Twig, and ERB using parser options and presets.
---

# Integrating Template Engine with HTML ESLint Plugin

## How to Enable Template Engine Integration

To integrate ESLint with your template engine, configure the `templateEngineSyntax` in your ESLint configuration as follows:

### Legacy config (.eslintrc.\*)

```js,.eslintrc.js
module.exports = {
  //...
  plugins: ["@html-eslint"],
  overrides: [
    {
      files: ["*.html"],
      parser: "@html-eslint/parser",
      parserOptions: {
        templateEngineSyntax: { // here
            "{{": "}}"
        }
      },
      extends: ["plugin:@html-eslint/recommended"],
    },
  ],
};
```

### Flat config

```js,eslint.config.js
const html = require("@html-eslint/eslint-plugin");
const htmlParser = require("@html-eslint/parser");

module.exports = [
  {
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    plugins: {
      "@html-eslint": html,
    },
    languageOptions: {
      parser: htmlParser,
      parserOptions: {
        templateEngineSyntax: { // here
             "{{": "}}"
        }
      }
    },
  },
];
```

### Language

```js,eslint.config.js
const html = require("@html-eslint/eslint-plugin");

module.exports = [
  {
    files: ["**/*.html"],
    plugins: {
      "@html-eslint": html
    },
    language: "@html-eslint/html",
    languageOptions: {
      templateEngineSyntax: {
        "{{": "}}"
      }
    }
  },
];
```

## Using Presets

To simplify the setup, the plugin provides built-in presets for common template engines. You can enable these presets by importing them from @html-eslint/parser:

```js
const { TEMPLATE_ENGINE_SYNTAX } = require("@html-eslint/parser");

// Handlebars integration
parserOptions: {
  templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.HANDLEBAR;
}

// Twig.js integration
parserOptions: {
  templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG;
}

// ERB integration
parserOptions: {
  templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.ERB;
}
```

## Skip frontmatter

If you are using frontmatter in html, set the parser options to `"frontmatter": true`, which tells the plugin to ignore the frontmatter part. (default: `false`)

```js
parserOptions: {
  frontmatter: true,
}
```

## rawContentTags

The `rawContentTags` option allows you to specify a list of tag names whose child content should be treated as raw text, rather than being parsed as HTML syntax. This is useful when working with custom components or templating systems where the content inside certain tags may contain characters like `<` or `>` that should not be interpreted as HTML.

### Example

```js
languageOptions: {
  rawContentTags: ["markdown"],
}
```

In this example, the content inside <markdown> tags will be treated as raw text:

```html
<markdown>
  const foo = <></>
</markdown>
```

Without rawContentTags, the parser may interpret `<></>` as invalid HTML syntax. With `rawContentTags: ["markdown"]`, the entire content inside `<markdown>` is preserved as plain text.
