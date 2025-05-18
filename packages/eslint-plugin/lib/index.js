const rules = require("./rules");
const recommended = require("./configs/recommended");
const parser = require("@html-eslint/parser");
const { HTMLLanguage } = require("./languages/html-language");
const { name, version } = require("../package.json");

/**
 * @typedef {import("./rules")} AllRules
 * @typedef {import("./configs/recommended")} RecommendedConfig
 * @typedef {{name: string, version: string}} PluginMeta
 * @typedef {{recommended: RecommendedConfig, "flat/recommended": import("eslint").Linter.FlatConfig }} HtmlESLintConfigs
 * @typedef {{html: HTMLLanguage}} Languages
 */

/**
 * @satisfies {import('eslint').ESLint.Plugin}
 */
const plugin = {
  meta: {
    name,
    version,
  },
  configs: {
    recommended,

    "flat/recommended": {
      plugins: {
        /** @type {import('eslint').ESLint.Plugin} */
        get "@html-eslint"() {
          return plugin;
        },
      },

      languageOptions: {
        parser,
      },
      rules: recommended.rules,
    },
  },
  languages: {
    html: new HTMLLanguage(),
  },
  rules,
};

module.exports = plugin;
