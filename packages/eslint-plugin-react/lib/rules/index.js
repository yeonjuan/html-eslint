const noInvalidAttrValue = require("./no-invalid-attr-value");
const useBaseline = require("./use-baseline");
const noIneffectiveAttrs = require("./no-ineffective-attrs");

const rules = {
  "no-invalid-attr-value": noInvalidAttrValue,
  "use-baseline": useBaseline,
  "no-ineffective-attrs": noIneffectiveAttrs,
};

module.exports = rules;
