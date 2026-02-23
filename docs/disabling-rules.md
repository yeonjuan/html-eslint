---
title: Disabling Rules
description: Learn how to disable HTML ESLint rules using inline HTML comments for entire files, specific lines, or individual rules.
---

# Disabling Rules

## Disable rules with inline comments

To disable a rule in a file, use HTML comments (`<!-- ... -->`) in the following format:

Disable all rules in an entire file:

```html
<!-- eslint-disable -->
<div foo="foo" foo="foo"></div>
```

Disable or enable specific rules in an entire file:

```html
<!-- eslint-disable @html-eslint/no-duplicate-attrs -->
<div foo="foo" foo="foo"></div>

<!-- eslint-enable @html-eslint/no-duplicate-attrs  -->
<div foo="foo" foo="foo"></div>
```

Disable all rules on a specific line:

```html
<!-- eslint-disable-next-line -->
<div foo="foo" foo="foo"></div>
```

Disable a specific rule on a specific line:

```html
<!-- eslint-disable-next-line @html-eslint/no-duplicate-attrs -->
<div foo="foo" foo="foo"></div>
```
