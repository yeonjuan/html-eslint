/** Exports all rules for @html-eslint/eslint-plugin-svelte */

import classSpacing from "./class-spacing.js";
import useBaseline from "./use-baseline.js";
import noObsoleteTags from "./no-obsolete-tags.js";
import noObsoleteAttrs from "./no-obsolete-attrs.js";
import noIneffectiveAttrs from "./no-ineffective-attrs.js";
import noDuplicateClass from "./no-duplicate-class.js";
import noInvalidAttrValue from "./no-invalid-attr-value.js";
// import new rule here ↑

const rules = {
  "class-spacing": classSpacing,
  "use-baseline": useBaseline,
  "no-obsolete-tags": noObsoleteTags,
  "no-obsolete-attrs": noObsoleteAttrs,
  "no-ineffective-attrs": noIneffectiveAttrs,
  "no-duplicate-class": noDuplicateClass,
  "no-invalid-attr-value": noInvalidAttrValue,
  // export new rule here ↑
};

export default rules;
