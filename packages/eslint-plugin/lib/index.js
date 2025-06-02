const rules = require("./rules");
const recommended = require("./configs/recommended");
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
  configs: {
    recommended,

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
      rules: recommended.rules,
    },
  },
  languages: {
    html: new HTMLLanguage(),
  },
  rules,
};

module.exports = plugin;
