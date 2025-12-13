const rules = require("../rules");

const allRules = Object.keys(rules).reduce((acc, ruleName) => {
  acc[`@html-eslint/${ruleName}`] = "error";
  return acc;
}, /** @type {Record<string, "error">} */ ({}));

module.exports = {
  allRules,
};
