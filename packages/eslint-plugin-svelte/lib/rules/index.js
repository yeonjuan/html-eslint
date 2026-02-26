/** Exports all rules for @html-eslint/eslint-plugin-svelte */

import classSpacing from "./class-spacing.js";
import useBaseline from "./use-baseline.js";
// import new rule here ↑

const rules = {
  "class-spacing": classSpacing,
  "use-baseline": useBaseline,
  // export new rule here ↑
};

export default rules;
