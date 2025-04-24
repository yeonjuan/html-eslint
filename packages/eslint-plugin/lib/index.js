const rules = require("./rules");
const recommended = require("./configs/recommended");
const parser = require("@html-eslint/parser");
const { HTMLLanguage } = require("./languages/html-language");

/**
 * @typedef {import("./rules")} AllRules
 * @typedef {import("./configs/recommended")} RecommendedConfig
 */

/**
 * @type {{rules: AllRules, configs: {recommended: RecommendedConfig, "flat/recommended": import("eslint").Linter.FlatConfig }}}
 */
const plugin = {
  // @ts-ignore
  configs: {
    recommended,
  },
  languages: {
    html: new HTMLLanguage(),
  },
  rules,
};

Object.assign(plugin.configs, {
  "flat/recommended": {
    plugins: {
      "@html-eslint": plugin,
    },

    languageOptions: {
      parser,
    },
    rules: recommended.rules,
  },
});

module.exports = plugin;
