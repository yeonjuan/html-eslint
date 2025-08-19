/** @satisfies {import('eslint').Linter.Config['rules']} */
const recommendedRules = {
  "html/require-lang": "error",
  "html/require-img-alt": "error",
  "html/require-doctype": "error",
  "html/require-title": "error",
  "html/no-multiple-h1": "error",
  "html/no-extra-spacing-attrs": "error",
  "html/attrs-newline": "error",
  "html/element-newline": [
    "error",
    {
      inline: [`$inline`],
    },
  ],
  "html/no-duplicate-id": "error",
  "html/indent": "error",
  "html/require-li-container": "error",
  "html/quotes": "error",
  "html/no-obsolete-tags": "error",
  "html/require-closing-tags": "error",
  "html/no-duplicate-attrs": "error",
  "html/use-baseline": "error",
  "html/no-duplicate-in-head": "error",
};

const recommendedLegacyRules = Object.entries(recommendedRules).reduce(
  (acc, [key, value]) => {
    acc[key.replace("html/", "@html-eslint/")] = value;
    return acc;
  },
  /** @type {Record<string, typeof recommendedRules[keyof typeof recommendedRules]>} */
  ({})
);

module.exports = {
  recommendedRules,
  recommendedLegacyRules,
};
