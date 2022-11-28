---
id: no-abstract-roles
title: "no-abstract-roles"
---

## Disallow use of abstract roles.

### Rule Details

This rule disallow use of abstract roles.

#### Abstract Roles
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

```html
<div role="command"></div>
<div role="composite"></div>
<div role="input"></div>
```

Examples of **correct** code for this rule:

```html
<div role="button"></div>
```

### Further reading

[HTML spec - Abstract Roles](https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles)
