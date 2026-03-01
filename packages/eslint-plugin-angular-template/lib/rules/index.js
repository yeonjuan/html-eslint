const useBaseline = require("./use-baseline");
const noDuplicateClass = require("./no-duplicate-class");
const classSpacing = require("./class-spacing");

const rules = {
  "use-baseline": useBaseline,
  "no-duplicate-class": noDuplicateClass,
  "class-spacing": classSpacing,
};

module.exports = rules;
