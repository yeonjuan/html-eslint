/** Configuration presets for @html-eslint/eslint-plugin-svelte */

import rules from "../rules/index.js";

const ruleKeys = Object.keys(rules);

const allRules = ruleKeys.reduce((acc, ruleName) => {
  acc[`@html-eslint/svelte/${ruleName}`] = "error";
  return acc;
}, /** @type {Record<string, "error" | "warn">} */ ({}));

export { allRules };
