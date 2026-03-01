---
paths:
  - "**/*.js"
---

# Coding Style Rules

## Type Imports in JavaScript Files

Type imports must be placed at the top of the file using TSDoc `@import` syntax.

### Rule

- Type imports should be declared using JSDoc/TSDoc `@import` comments
- These `@import` declarations must be placed at the very top of the file, before any `require()` statements
- Each type import should be on its own line within a JSDoc comment block
- When specifying parameter types in `@param`, use the imported types from the top of the file, NOT inline `import()` statements

### Examples

**Good:**

```javascript
/**
 * @import {AST} from "eslint"
 * @import {
 *   JSXAttribute,
 *   JSXIdentifier,
 *   Literal,
 *   Node,
 *   TemplateLiteral
 * } from "../../types"
 */
const { AST_NODE_TYPES } = require("../../constants/node-types");

// rest of the code...
```

**Bad:**

```javascript
const { AST_NODE_TYPES } = require("../../constants/node-types");

/** @import {AST} from "eslint" */
// Type import is not at the top of the file
```

**Bad:**

```javascript
// Missing @import declarations for types used in JSDoc comments
const { AST_NODE_TYPES } = require("../../constants/node-types");

/** @param {AST.SourceLocation} location */
function adjustLocation(location) {
  // ...
}
```

**Bad:**

```javascript
// Using inline import() instead of @import at the top
const { AST_NODE_TYPES } = require("../../constants/node-types");

/**
 * @param {import("eslint").AST.SourceLocation} location
 * @param {import("../../types").Node} node
 */
function adjustLocation(location, node) {
  // ...
}
```

**Good (for the above):**

```javascript
/**
 * @import {AST} from "eslint"
 * @import {Node} from "../../types"
 */
const { AST_NODE_TYPES } = require("../../constants/node-types");

/**
 * @param {AST.SourceLocation} location
 * @param {Node} node
 */
function adjustLocation(location, node) {
  // ...
}
```
