---
title: Integrating Template Engine
description: Learn how to integrate HTML ESLint with template engines like Handlebars, Twig, Nunjucks, and ERB using parser options and presets.
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

To simplify the setup, the plugin provides built-in presets for common template engines. You can enable these presets by importing them from `@html-eslint/parser`:

```js
const { TEMPLATE_ENGINE_SYNTAX } = require("@html-eslint/parser");

// Handlebars
parserOptions: {
  templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.HANDLEBAR;
}

// Handlebars with branch-aware duplicate checking (recommended — see below)
parserOptions: {
  templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.HANDLEBAR_EXTENDED;
}

// Twig
parserOptions: {
  templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG;
}

// Nunjucks
parserOptions: {
  templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.NUNJUCKS;
}

// ERB
parserOptions: {
  templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.ERB;
}
```

## Branch-Aware Duplicate Checking

Rules such as `html/no-duplicate-id`, `html/no-duplicate-attrs`, and `html/no-duplicate-in-head` normally report an error whenever the same id, attribute, or head tag appears more than once in a file. This is usually correct, but it produces false positives when the duplicates are inside mutually exclusive template branches — a pattern that is common and intentional:

```twig
<p>
  {% if result is same as(null) %}
    <span id="status"></span>
  {% elseif result is same as(false) %}
    <span id="status" class="failure">Invalid</span>
  {% else %}
    <span id="status" class="success">Valid</span>
  {% endif %}
</p>
```

In the example above all three `<span id="status">` elements are in different branches of the same `{% if %}` block, so only one of them can ever be present in the rendered HTML at a time. This is not a real duplicate.

The presets listed in the table below include branch pattern configuration that teaches the parser which template tokens open, continue, and close a conditional block. When branch information is available, the duplicate-checking rules automatically suppress errors for nodes that are confined to mutually exclusive branches.

| Preset               | Branch-aware |
| -------------------- | ------------ |
| `TWIG`               | ✓            |
| `NUNJUCKS`           | ✓            |
| `HANDLEBAR_EXTENDED` | ✓            |
| `HANDLEBAR`          | ✗            |
| `ERB`                | ✗            |

`HANDLEBAR` is kept for backwards compatibility. `HANDLEBAR_EXTENDED` is the recommended preset for Handlebars projects going forward.

`ERB` does not support branch-awareness because ERB's `end` keyword closes every block type — `if`, `unless`, `while`, `each`, and any custom iterator — making it impossible to reliably detect conditional branches without a full Ruby parser.

## Custom Branch Configuration

If you are using a template engine that is not covered by a built-in preset, or if you have customized the delimiters of a supported engine, you can provide branch patterns manually.

Branch configuration is supplied as the `branch` property of a `SyntaxConfigItem`. It must use the array form of `templateEngineSyntax` (not the `{ "open": "close" }` shorthand, which has no place to carry extra properties):

```js
parserOptions: {
  templateEngineSyntax: [
    {
      open: "{%",
      close: "%}",
      branch: {
        // Matches the content of tokens that open a new conditional block.
        start: /^\s*if\b/,
        // Matches the content of tokens that separate branches (else / elseif).
        continue: /^\s*(elseif|else)\b/,
        // Matches the content of tokens that close the conditional block.
        end: /^\s*endif\b/,
        // Optional: matches tokens that open other block types which may
        // themselves contain an else clause (e.g. for, macro).
        // Without this, an else inside a for-loop could be mistaken for
        // the else of an enclosing if-block.
        blockOpen: /^\s*(for|block|macro)\b/,
        // Optional: matches the closing tokens for those other block types.
        blockClose: /^\s*end(for|block|macro)\b/,
      },
    },
    // Additional delimiter pairs without branch config are listed normally:
    { open: "{{", close: "}}" },
    { open: "{#", close: "#}", isComment: true },
  ];
}
```

All patterns are matched against the raw content between the opening and closing delimiters of each template token. For example, the content of `{% if condition %}` is `if condition` (including surrounding whitespace), so a pattern of `/^\s*if\b/` matches it correctly.

`blockOpen` and `blockClose` are optional but strongly recommended for any engine where block constructs other than `if` can contain their own `else`. Omitting them may cause a false suppression of a real duplicate error if an `else` belonging to a `for` loop is misread as the `else` of an enclosing `if`.

## Skip frontmatter

If you are using frontmatter in HTML, set the parser option `"frontmatter": true`, which tells the plugin to ignore the frontmatter part. (default: `false`)

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

In this example, the content inside `<markdown>` tags will be treated as raw text:

```html
<markdown>
  const foo = <></>
</markdown>
```

Without `rawContentTags`, the parser may interpret `<></>` as invalid HTML syntax. With `rawContentTags: ["markdown"]`, the entire content inside `<markdown>` is preserved as plain text.
