import noInvalidAttrValue from "./rules/no-invalid-attr-value.js";

export default {
  meta: {
    name: "@html-eslint/svelte",
    version: "0.1.0",
  },
  configs: {
    recommended: {
      plugins: ["@html-eslint/svelte"],
      rules: {
        "@html-eslint/svelte/no-invalid-attr-value": "error",
      },
    },
  },
  rules: {
    "no-invalid-attr-value": noInvalidAttrValue,
  },
  processors: {},
};
