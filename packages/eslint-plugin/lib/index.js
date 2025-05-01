const rules = require("./rules");
const recommended = require("./configs/recommended");
const parser = require("@html-eslint/parser");
const { HTMLLanguage } = require("./languages/html-language");
const { name, version } = require("../package.json");
/**
 * @typedef {import("./rules")} AllRules
 * @typedef {import("./configs/recommended")} RecommendedConfig
 */

/**
 * @type {{meta: { name: string, version: string }, rules: AllRules, configs: {recommended: RecommendedConfig, "flat/recommended": import("eslint").Linter.FlatConfig }}}
 */
const plugin = {
  meta: {
    name,
    version,
  },
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
