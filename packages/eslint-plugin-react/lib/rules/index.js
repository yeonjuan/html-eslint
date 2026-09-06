const noInvalidAttrValue = require("./no-invalid-attr-value");
const useBaseline = require("./use-baseline");
const noIneffectiveAttrs = require("./no-ineffective-attrs");
const noObsoleteTags = require("./no-obsolete-tags");
const noObsoleteAttrs = require("./no-obsolete-attrs");
const classnameSpacing = require("./classname-spacing");
const noDuplicateClassname = require("./no-duplicate-classname");
const noRestrictedAttrs = require("./no-restricted-attrs");
// import new rule here ↑

const rules = {
  "no-invalid-attr-value": noInvalidAttrValue,
  "use-baseline": useBaseline,
  "no-ineffective-attrs": noIneffectiveAttrs,
  "no-obsolete-tags": noObsoleteTags,
  "no-obsolete-attrs": noObsoleteAttrs,
  "classname-spacing": classnameSpacing,
  "no-duplicate-classname": noDuplicateClassname,
  "no-restricted-attrs": noRestrictedAttrs,
  // export new rule here ↑
};

module.exports = rules;
