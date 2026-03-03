const useBaseline = require("./use-baseline");
const noDuplicateClass = require("./no-duplicate-class");
const classSpacing = require("./class-spacing");
const noObsoleteTags = require("./no-obsolete-tags");
const noIneffectiveAttrs = require("./no-ineffective-attrs");
const noObsoleteAttrs = require("./no-obsolete-attrs");
const noInvalidAttrValue = require("./no-invalid-attr-value");

const rules = {
  "use-baseline": useBaseline,
  "no-duplicate-class": noDuplicateClass,
  "class-spacing": classSpacing,
  "no-obsolete-tags": noObsoleteTags,
  "no-ineffective-attrs": noIneffectiveAttrs,
  "no-obsolete-attrs": noObsoleteAttrs,
  "no-invalid-attr-value": noInvalidAttrValue,
};

module.exports = rules;
