const noInvalidAttrValue = require("./rules/no-invalid-attr-value.js");

module.exports = {
  meta: {
    name: "@html-eslint/angular",
    version: "0.1.0",
  },
  configs: {
    recommended: {
      plugins: ["@html-eslint/angular"],
      rules: {
        "@html-eslint/angular/no-invalid-attr-value": "error",
      },
    },
  },
  rules: {
    "no-invalid-attr-value": noInvalidAttrValue,
  },
  processors: {},
};
