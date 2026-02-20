const noInvalidAttrValue = require("./no-invalid-attr-value");
const useBaseline = require("./use-baseline");
const noIneffectiveAttrs = require("./no-ineffective-attrs");
const noObsoleteAttrs = require("./no-obsolete-attrs");

const rules = {
  "no-invalid-attr-value": noInvalidAttrValue,
  "use-baseline": useBaseline,
  "no-ineffective-attrs": noIneffectiveAttrs,
  "no-obsolete-attrs": noObsoleteAttrs,
};

module.exports = rules;
