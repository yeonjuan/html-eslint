const rules = require("./rules");
const recommended = require("./configs/recommended");
const parser = require("@html-eslint/parser");

const plugin = {
  configs: {
    recommended,
  },
  rules,
};

Object.assign(plugin.configs, {
  "flat/recommended": {
    plugin: {
      "@html-eslint": plugin,
    },
    languageOptions: {
      parser,
    },
    rules: recommended.rules,
  },
});

module.exports = plugin;
