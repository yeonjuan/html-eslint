const rules = require("./rules");
const recommended = require("./configs/recommended");
const parser = require("@html-eslint/parser");

/**
 * @type {{configs: {recommended: typeof recommended,"flat/recommended": import("eslint").Linter.FlatConfig , rules: typeof rules}}}
 */
const plugin = {
  // @ts-ignore
  configs: {
    recommended,
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
