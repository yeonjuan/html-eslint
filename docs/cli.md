---
id: cli
title: CLI (Run on URLs)
---

## Run HTML-ESLint on URLs.

### Installation

```
$ npm install -g @html-eslint/cli
```

### Configuration

- `.htmleslintrc.js`

```javascript
module.exports = {
  rules: {
    "@html-eslint/require-lang": "error",
    "@html-eslint/require-img-alt": "error",
    "@html-eslint/require-doctype": "error",
    "@html-eslint/require-title": "error",
    "@html-eslint/no-multiple-h1": "error",
    // ...
  },
};
```

### Run

```
$ html-eslint https://www.example.com
```

### Options

- `--config` (`-c`)

  Specify configuration file to use.

  ```
  $ html-eslint https://www.example.com --config path/of/configuration
  # or
  $ html-eslint https://www.example.com -c path/of/configuration
  ```

- `--check-style`

  Enable `Style` rules in configuration. By default, All rules with the category `Style` are ignored.

  ```
  $ html-eslint https://www.example.com --check-style
  ```
