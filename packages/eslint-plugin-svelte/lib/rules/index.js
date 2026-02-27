/** Exports all rules for @html-eslint/eslint-plugin-svelte */

import classSpacing from "./class-spacing.js";
import useBaseline from "./use-baseline.js";
import noObsoleteTags from "./no-obsolete-tags.js";
import noObsoleteAttrs from "./no-obsolete-attrs.js";
// import new rule here ↑

const rules = {
  "class-spacing": classSpacing,
  "use-baseline": useBaseline,
  "no-obsolete-tags": noObsoleteTags,
  "no-obsolete-attrs": noObsoleteAttrs,
  // export new rule here ↑
};

export default rules;
