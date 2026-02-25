const rules = require("../rules");
const ruleKeys = Object.keys(rules);

const allRules = ruleKeys.reduce((acc, ruleName) => {
  acc[`@html-eslint/angular/${ruleName}`] = "error";
  if (ruleName === "use-baseline") {
    acc[`@html-eslint/angular/${ruleName}`] = "warn";
  }
  return acc;
}, /** @type {Record<string, "error" | "warn">} */ ({}));

module.exports = {
  allRules,
};
