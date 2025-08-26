const rules = require("./rules");
const {
  recommendedRules,
  recommendedLegacyRules,
} = require("./configs/recommended");
const { HTMLLanguage } = require("./languages/html-language");
const { name, version } = require("../package.json");
const parser = require("@html-eslint/parser");
/**
 * @import { ESLint } from "eslint";
 */

/**
 * @satisfies {ESLint.Plugin}
 */
const plugin = {
  meta: {
    name,
    version,
  },
  languages: {
    html: new HTMLLanguage(),
  },
  rules,
  configs: {
    recommended: {
      rules: recommendedRules,
      plugins: {},
    },
    ["recommended-legacy"]: {
      rules: recommendedLegacyRules,
    },
    "flat/recommended": {
      plugins: {
        /** @type {ESLint.Plugin} */
        get "@html-eslint"() {
          return plugin;
        },
      },
      languageOptions: {
        parser,
      },
      rules: recommendedLegacyRules,
    },
  },
};

{
  // @ts-ignore
  plugin.configs.recommended.plugins.html = plugin;
}

module.exports = plugin;
