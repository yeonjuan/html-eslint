module.exports = {
  "@html-eslint/attrs-newline": [
    `error`,
    {
      closeStyle: `newline`,
      ifAttrsMoreThan: 2,
    },
  ],
  "@html-eslint/element-newline": [`error`],
  "@html-eslint/indent": [`error`, `tab`],
  "@html-eslint/lowercase": `error`,
  "@html-eslint/no-abstract-roles": `error`,
  "@html-eslint/no-accesskey-attrs": `error`,
  "@html-eslint/no-aria-hidden-body": `error`,
  "@html-eslint/no-duplicate-attrs": `error`,
  "@html-eslint/no-duplicate-id": `error`,
  "@html-eslint/no-extra-spacing-attrs": [
    `error`,
    {
      disallowMissing: true,
      disallowTabs: true,
      enforceBeforeSelfClose: true,
    },
  ],
  "@html-eslint/no-inline-styles": `off`,
  "@html-eslint/no-multiple-empty-lines": [
    `error`,
    {
      max: 2,
    },
  ],
  "@html-eslint/no-multiple-h1": `warn`,
  "@html-eslint/no-non-scalable-viewport": `warn`,
  "@html-eslint/no-obsolete-tags": `error`,
  "@html-eslint/no-positive-tabindex": `warn`,
  "@html-eslint/no-script-style-type": `error`,
  "@html-eslint/no-skip-heading-levels": `warn`,
  "@html-eslint/no-target-blank": `error`,
  "@html-eslint/no-trailing-spaces": `error`,
  "@html-eslint/quotes": [`error`, `double`],
  "@html-eslint/require-button-type": `error`,
  "@html-eslint/require-closing-tags": [
    `error`,
    {
      selfClosing: `always`,
    },
  ],
  "@html-eslint/require-doctype": `error`,
  "@html-eslint/require-frame-title": `error`,
  "@html-eslint/require-img-alt": `error`,
  "@html-eslint/require-lang": `error`,
  "@html-eslint/require-li-container": `error`,
  "@html-eslint/require-meta-charset": `warn`,
  "@html-eslint/require-meta-description": `warn`,
  "@html-eslint/require-meta-viewport": `warn`,
  "@html-eslint/require-title": `error`,
  "@html-eslint/sort-attrs": [
    `error`,
    {
      priority: [],
    },
  ],
};
