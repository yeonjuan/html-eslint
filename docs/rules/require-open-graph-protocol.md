# require-open-graph-protocol

This rule enforces the use of specified meta tags for open graph protocol.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/require-open-graph-protocol": "error",
  },
};
```

## Rule Details

### Options

You can specify an array of ogp names to enforce.

Examples of **incorrect** code for this rule with the default `['og:title', 'og:type', 'og:url', 'og:image']` options:

```html,incorrect
<html>
  <head>
    <title>title</title>
  </head>
</html>
```

<!-- prettier-ignore -->
```html,incorrect
<html>
  <head>
    <title>title</title>
    <!-- empty values -->
    <meta property="og:url" />
    <meta property="og:image" content="" /> 
  </head>
</html>
```

Examples of **correct** code for this rule:

```html,correct
<html>
  <head>
    <title>title</title>
    <meta property="og:url" content="https://canonical-url.com" />
    <meta property="og:type" content="video.movie" />
    <meta property="og:title" content="title" />
    <meta property="og:image" content="https://image.png" />
  </head>
</html>
```

## Further Reading

- [The Open Graph protocol](https://ogp.me/)
