const rules = require("../rules");
const ruleKeys = Object.keys(rules);

const allRules = ruleKeys.reduce((acc, ruleName) => {
  acc[`@html-eslint/react/${ruleName}`] = "error";
  return acc;
}, /** @type {Record<string, "error">} */ ({}));

module.exports = {
  allRules,
};
