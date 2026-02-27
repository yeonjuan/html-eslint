---
paths:
  - "**/rules/*.test.js"
---

# Writing Rule Tests

## Invalid Test Cases

When writing invalid test cases, you MUST include `line` and `column` properties in the error objects to specify the exact location where the error should be reported.

### Example

```javascript
{
  code: '<a charset="UTF-8">Link</a>',
  errors: [
    {
      messageId: "obsolete",
      line: 1,
      column: 4,
      data: {
        attr: "charset",
        element: "a",
        suggestion: "Use an HTTP `Content-Type` header on the linked resource instead.",
      },
    },
  ],
}
```

### Why This Is Important

- Ensures the rule reports errors at the correct location in the source code
- Helps catch regressions if the error location changes unexpectedly
- Makes test failures more informative by showing exact position mismatches
- Follows ESLint testing best practices
