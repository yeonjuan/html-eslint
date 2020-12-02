# Require `title` attribute in `<frame>` and `<iframe>`

## Rule Details

This rule enforces usr of `title` attribute in `<frame>` and `<iframe>`.

Examples of **incorrect** code for this rule:

```html
<iframe src="..."></iframe> <iframe src="..." title=""></iframe>
```

Examples of **correct** code for this rule:

```html
<iframe src="..." title="frame title"></iframe>
```
