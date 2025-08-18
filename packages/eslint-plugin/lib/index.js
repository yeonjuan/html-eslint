const rules = require("./rules");
const {
  recommendedRules,
  recommendedLegacyRules,
} = require("./configs/recommended");
const parser = require("@html-eslint/parser");
const { HTMLLanguage } = require("./languages/html-language");
const { name, version } = require("../package.json");

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
  },
};

{
  // @ts-ignore
  plugin.configs.recommended.plugins.html = plugin;
}

module.exports = plugin;
