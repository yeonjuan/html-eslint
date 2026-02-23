---
title: no-abstract-roles
description: Disallow use of abstract ARIA roles that should not be used in HTML markup.
---

# no-abstract-roles

This rule disallows the use of abstract ARIA roles.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-abstract-roles": "error",
  },
};
```

## Rule Details

Abstract roles are part of the ARIA (Accessible Rich Internet Applications) specification, but they are not intended for direct use in HTML. Using these roles has no effect and may lead to accessibility issues.

The following abstract roles are disallowed by this rule:

- Abstract roles
  - command
  - composite
  - input
  - landmark
  - range
  - roletype
  - section
  - sectionhead
  - select
  - structure
  - widget
  - window

Examples of **incorrect** code for this rule:

```html,incorrect
<div role="command"></div>
<div role="composite"></div>
<div role="input"></div>
```

Examples of **correct** code for this rule:

```html,correct
<div role="button"></div>
```

## Further Reading

- [HTML spec - Abstract Roles](https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles)
