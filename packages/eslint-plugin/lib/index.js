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
 * @type {{meta: PluginMeta, rules: AllRules, configs: HtmlESLintConfigs, languages: Languages}}
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
