const rules = require("../rules");
const ruleKeys = Object.keys(rules);

const allRulesLegacy = ruleKeys.reduce((acc, ruleName) => {
  acc[`@html-eslint/${ruleName}`] = "error";
  return acc;
}, /** @type {Record<string, "error">} */ ({}));

const allRules = ruleKeys.reduce((acc, ruleName) => {
  acc[`html/${ruleName}`] = "error";
  return acc;
}, /** @type {Record<string, "error">} */ ({}));

module.exports = {
  allRulesLegacy,
  allRules,
};
