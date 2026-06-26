# `@html-eslint/cli`

CLI tool for linting HTML pages by URL.

## Installation

```bash
npm install -g @html-eslint/cli
```

## Configuration

Create `.htmleslintrc.js` in your project root:

```js
module.exports = {
  rules: {
    "@html-eslint/require-doctype": "error",
    "@html-eslint/require-title": "error",
    "@html-eslint/require-img-alt": "error",
    "@html-eslint/no-multiple-h1": "error",
  },
};
```

## Usage

```bash
html-eslint https://example.com
```

## Options

| Option            | Alias | Description                                              |
| ----------------- | ----- | -------------------------------------------------------- |
| `--config <path>` | `-c`  | Path to configuration file (default: `.htmleslintrc.js`) |
| `--check-style`   |       | Enable style rules (disabled by default)                 |

## License

MIT
