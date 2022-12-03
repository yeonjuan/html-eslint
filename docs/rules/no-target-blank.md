---
id: no-target-blank
title: "no-target-blank"
---

# no-target-blank

## Disallow usage of unsafe `target='_blank'`

### Rule Details

...

Examples of **incorrect** code for this rule:

```html
<a target='_blank' href="http://example.com/"></a>
```

Examples of **correct** code for this rule:

```html
<a target="_blank" href="relative/path/"></a>
<a target="_blank" rel="noreferrer" href="http://example.com/"></a>
```

### Further reading
