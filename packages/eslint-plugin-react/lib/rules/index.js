const noInvalidAttrValue = require("./no-invalid-attr-value");
const useBaseline = require("./use-baseline");
const noIneffectiveAttrs = require("./no-ineffective-attrs");
const noObsoleteTags = require("./no-obsolete-tags");
const noObsoleteAttrs = require("./no-obsolete-attrs");
const classnameSpacing = require("./classname-spacing");

const rules = {
  "no-invalid-attr-value": noInvalidAttrValue,
  "use-baseline": useBaseline,
  "no-ineffective-attrs": noIneffectiveAttrs,
  "no-obsolete-tags": noObsoleteTags,
  "no-obsolete-attrs": noObsoleteAttrs,
  "classname-spacing": classnameSpacing,
};

module.exports = rules;
