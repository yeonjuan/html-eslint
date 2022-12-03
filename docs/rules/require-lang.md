---
id: require-lang
title: "require-lang"
---

# require-lang

## Require `lang` attribute at `html` tag

The `lang` attribute is used to represent the language used in the content.
We can give information to the search engine about the language used in the content.

### Rule Details

This rule enforces the `lang` attribute at `html` tag

Examples of **incorrect** code for this rule:

```html
<html>
  ...
</html>

<html lang="">
  ...
</html>
```

Examples of **correct** code for this rule:

```html
<html lang="ko">
  ...
</html>
```

### Further reading

[MDN - lang](https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/lang)
