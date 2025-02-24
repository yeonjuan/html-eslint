const rules = require("./rules");
const recommended = require("./configs/recommended");
const parser = require("@html-eslint/parser");
const frontmatter = require("./processors/frontmatter");

/**
 * @type {{configs: {recommended: typeof recommended,"flat/recommended": import("eslint").Linter.FlatConfig , rules: typeof rules}}}
 */
const plugin = {
  // @ts-ignore
  configs: {
    recommended,
  },
  processors: {
    frontmatter,
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
