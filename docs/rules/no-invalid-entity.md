---
title: no-invalid-entity
description: Disallow invalid HTML entities to prevent rendering issues and invalid markup.
---
# no-invalid-entity

Disallow use of invalid HTML entities.

## Rule Details

This rule disallows the use of invalid HTML entities in your markup. HTML entities are special codes used to represent characters with specific meanings in HTML, such as `<` (`<`) or `&` (`&`). Invalid entities—such as typos, undefined entities, or malformed numeric references—can be silently ignored by browsers, leading to rendering issues or confusion.

The rule validates both named entities (e.g., ` `) and numeric entities (e.g., ` ` for decimal or ` ` for hexadecimal) against a list of valid entities defined in `entities.json`. An entity is considered invalid if:

- It is a named entity not found in `entities.json` (e.g., `&nbsb;` or `&unknown;`).
- It is a numeric entity with an invalid format (e.g., `&#zzzz;`).
- It is a numeric entity outside the valid Unicode range (0 to 0x10FFFF, e.g., `�`).

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-invalid-entity": "error",
  },
};
```

### Examples

#### Incorrect Code

```html
<p>&nbsb;</p>        <!-- typo -->
<p>&unknown;</p>     <!-- undefined entity -->
<p>&#zzzz;</p>       <!-- invalid numeric reference -->
```

#### Correct Code

```html
<p>&lt; &gt; &amp; &nbsp; &#160; &#xA0;</p>
```

## When Not To Use It

Disable this rule if you are intentionally using invalid entities for specific purposes, such as testing or non-standard rendering. Be aware that invalid entities may not render consistently across different browsers.
