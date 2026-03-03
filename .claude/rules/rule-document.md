---
paths:
  - "**/rules/*.md"
---

# Rule Documentation Guidelines

## Overview

Rule documentation should be user-focused and concise. The goal is to help users understand what the rule does and how to use it, not to expose every implementation detail.

## Structure

Each rule documentation file should follow this structure:

1. **Title and Description** (YAML frontmatter)
2. **Rule Name** (H1)
3. **How to Use** section
4. **Rule Details** section
5. **Examples** section (with incorrect and correct code)
6. **When Not To Use It** section (optional)
7. **Further Reading** section (optional)

## Guidelines

### 1. Keep Implementation Details Private

**DO NOT** expose exhaustive lists of every case the rule checks. Instead, provide representative examples.

**Bad:**

```markdown
## Checked Attributes

This rule checks for the following 50+ obsolete attributes:

- `align` on div, p, h1, h2, h3, h4, h5, h6, table, tr, td, th, ...
- `bgcolor` on body, table, tr, td, th, ...
- ... (50+ more items)
```

**Good:**

```markdown
## Rule Details

This rule disallows using obsolete attributes on HTML elements and provides suggestions for modern alternatives.

Common obsolete attributes include presentational attributes like `align`, `bgcolor`, and `border`. Use CSS instead.
```

### 2. Focus on User Intent

Explain **what** the rule does and **why** it matters, not **how** it works internally.

**Bad:**

```markdown
The rule iterates through all attributes, checks if the attribute key has an expression,
validates the attribute value against a lookup table of 200+ entries...
```

**Good:**

```markdown
This rule helps you write modern, standards-compliant HTML by catching obsolete
attributes that should be replaced with CSS or modern alternatives.
```

### 3. Provide Representative Examples

Show 3-5 clear examples for both incorrect and correct code. Don't try to show every possible case.

**Bad:**

```markdown
## Examples

<!-- Showing 50+ test cases -->
```

**Good:**

```markdown
## Examples

Examples of **incorrect** code for this rule:

\`\`\`html

<!-- Obsolete presentational attributes -->
<div align="center">Content</div>
<table bgcolor="#ffffff"></table>

<!-- Obsolete name attribute -->

<a name="anchor">Link</a>
\`\`\`

Examples of **correct** code for this rule:

\`\`\`html

<!-- Use CSS instead -->
<div style="text-align: center;">Content</div>
<table style="background-color: #ffffff;"></table>

<!-- Use id instead -->

<a id="anchor">Link</a>
\`\`\`
```

### 4. Group Similar Cases

When showing examples, group similar violations together with a brief comment.

```markdown
<!-- Obsolete presentational attributes -->
<div align="center">Content</div>
<table bgcolor="#ffffff" border="1"></table>
```

### 5. Omit Internal Details

**DO NOT** include:

- Complete lists of all checked values
- Implementation algorithms
- Internal data structures
- Edge case handling details

**DO** include:

- What the rule checks for (high-level)
- Why it matters
- How to fix violations
- Framework-specific considerations (e.g., "Angular property bindings are skipped")

### 6. Keep "How to Use" Consistent

Always show the flat config format with the correct plugin name and parser (if needed).

```markdown
## How to use

\`\`\`js
// eslint.config.js (flat config)
import angularTemplate from "@html-eslint/eslint-plugin-angular-template";
import templateParser from "@angular-eslint/template-parser";

export default [
{
files: ["**/*.html"],
languageOptions: {
parser: templateParser,
},
plugins: {
"@html-eslint/angular-template": angularTemplate,
},
rules: {
"@html-eslint/angular-template/rule-name": "error",
},
},
];
\`\`\`
```

### 7. Use Concise Descriptions

The description should be one clear sentence.

**Bad:**

```markdown
description: This rule is designed to help developers avoid using obsolete
HTML attributes that were deprecated in HTML5 and should no longer be used
in modern web development because they have been replaced by CSS...
```

**Good:**

```markdown
description: Disallow obsolete HTML attributes in Angular templates that are deprecated in HTML5.
```

## Template

```markdown
---
title: rule-name
description: Brief one-sentence description of what the rule does.
---

# rule-name

Brief introduction paragraph explaining what the rule does.

## How to use

\`\`\`js
// Configuration example
\`\`\`

## Rule Details

Explanation of what the rule checks and why it matters.

**Note**: Any framework-specific notes (e.g., "Custom elements are ignored").

## Examples

Examples of **incorrect** code for this rule:

\`\`\`html

<!-- 3-5 representative examples -->

\`\`\`

Examples of **correct** code for this rule:

\`\`\`html

<!-- 3-5 representative examples -->

\`\`\`

## When Not To Use It

Optional section explaining when this rule might not be appropriate.

## Further Reading

Optional links to relevant specifications or documentation.
```

## Summary

- **User-focused**: Write for developers using the rule, not for rule implementers
- **Concise**: Show representative examples, not exhaustive lists
- **Clear**: Explain what and why, not how
- **Consistent**: Follow the standard structure and format
