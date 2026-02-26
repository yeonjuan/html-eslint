You are helping add a new lint rule to the `@html-eslint/eslint-plugin` package.

## Step 1: Gather requirements

Ask the user for the following if not already provided:

1. **Rule name** — must be lowercase with hyphens (e.g., `require-lang`). If not provided, ask for it.
2. **Rule description** — a brief explanation of what the rule enforces and why it is useful. If not provided, ask for it.

Do not proceed until both pieces of information are confirmed.

## Step 2: Scaffold the rule

Once the rule name and description are confirmed, run the following command from the project root:

```bash
yarn new-rule {rule-name}
```

This generates:

- `packages/eslint-plugin/lib/rules/{rule-name}.js` — rule implementation stub
- `packages/eslint-plugin/tests/rules/{rule-name}.test.js` — test file stub
- `docs/rules/{rule-name}.md` — documentation stub
- Updates `packages/eslint-plugin/lib/rules/index.js` with the new rule import and export

## Step 3: Write the documentation

Fill in `docs/rules/{rule-name}.md` with appropriate content based on the rule description provided by the user.

The documentation must follow this structure (refer to existing docs like `docs/rules/require-button-type.md` as a reference):

```markdown
---
title: { rule-name }
description: >-
  {One-sentence description of the rule.}
---

# {rule-name}

{A paragraph explaining what the rule enforces and why.}

## How to use

\`\`\`js,.eslintrc.js
module.exports = {
rules: {
"@html-eslint/{rule-name}": "error",
},
};
\`\`\`

## Rule Details

Examples of **incorrect** code for this rule:

<!-- prettier-ignore -->
\`\`\`html,incorrect
{incorrect HTML examples}
\`\`\`

Examples of **correct** code for this rule:

\`\`\`html,correct
{correct HTML examples}
\`\`\`

## Options

{Document any options here, or omit this section if there are none.}

## Further Reading

{Optional links to relevant specs or resources.}
```

## Step 4: Done

After writing the documentation, inform the user that:

- The scaffolding has been created
- The documentation has been written
- They should implement the rule logic in `packages/eslint-plugin/lib/rules/{rule-name}.js`
- They should add test cases in `packages/eslint-plugin/tests/rules/{rule-name}.test.js`
