const rules = require("../rules");
const ruleKeys = Object.keys(rules);

const allRules = ruleKeys.reduce((acc, ruleName) => {
  acc[`@html-eslint/react/${ruleName}`] = "error";
  if (ruleName === "use-baseline") {
    acc[`@html-eslint/react/${ruleName}`] = "warning";
  }
  return acc;
}, /** @type {Record<string, "error" | "warning">} */ ({}));

module.exports = {
  allRules,
};
