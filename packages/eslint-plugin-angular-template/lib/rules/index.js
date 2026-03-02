const useBaseline = require("./use-baseline");
const noDuplicateClass = require("./no-duplicate-class");
const classSpacing = require("./class-spacing");
const noObsoleteTags = require("./no-obsolete-tags");

const rules = {
  "use-baseline": useBaseline,
  "no-duplicate-class": noDuplicateClass,
  "class-spacing": classSpacing,
  "no-obsolete-tags": noObsoleteTags,
};

module.exports = rules;
