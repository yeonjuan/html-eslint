const useBaseline = require("./use-baseline");
const noDuplicateClass = require("./no-duplicate-class");

const rules = {
  "use-baseline": useBaseline,
  "no-duplicate-class": noDuplicateClass,
};

module.exports = rules;
