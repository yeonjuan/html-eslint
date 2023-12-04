# no-abstract-roles

This rule disallows use of abstract roles.

## How to use

```js,.eslintrc.js
module.exports = {
  rules: {
    "@html-eslint/no-abstract-roles": "error",
  },
};
```

## Rule Details

This rule disallows the use of abstract roles.

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
