const ESLint = require("eslint");

/** @type {any} */
const LEGACY_OPTIONS = {
  plugins: {
    // @ts-ignore
    "@html-eslint": require("@html-eslint/eslint-plugin"),
  },
  languageOptions: {
    parser: require("@html-eslint/parser"),
  },
};

/** @type {any} */
const LANGUAGE_OPTIONS = {
  plugins: {
    // @ts-ignore
    "@html-eslint": require("@html-eslint/eslint-plugin"),
  },
  languageOptions: {
    parser: require("@html-eslint/parser"),
  },
};

/**
 * @param {any} options
 * @returns
 */
function getLinter(options) {
  const linter = new ESLint.Linter({
    configType: "flat",
  });

  return {
    /**
     * @param {string} code
     * @param {any} rulesConfig
     * @returns
     */
    lint(code, rulesConfig) {
      return linter.verify(code, {
        ...options,
        rules: rulesConfig,
      });
    },
  };
}

describe("inline disable", () => {
  const legacyLinter = getLinter(LEGACY_OPTIONS);
  const languageLinter = getLinter(LANGUAGE_OPTIONS);

  it("eslint-disable all rules", () => {
    const code = `
<!-- eslint-disable -->
<div style="foo"></div>
<div foo="foo" foo="foo"></div>
   `;
    const rules = {
      "@html-eslint/no-inline-styles": "error",
      "@html-eslint/no-duplicate-attrs": "error",
    };

    const legacyResult = legacyLinter.lint(code, rules);
    expect(legacyResult).toHaveLength(0);
    const languageResult = languageLinter.lint(code, rules);
    expect(languageResult).toHaveLength(0);
  });

  it("eslint-disable and enable all rules", () => {
    const code = `
<!-- eslint-disable -->
<div style="foo"></div>
<!-- eslint-enable -->
<div style="foo"></div>
<div foo="foo" foo="foo"></div>
   `;
    const rules = {
      "@html-eslint/no-inline-styles": "error",
      "@html-eslint/no-duplicate-attrs": "error",
    };

    const legacyResult = legacyLinter.lint(code, rules);
    expect(legacyResult).toHaveLength(2);
    const languageResult = languageLinter.lint(code, rules);
    expect(languageResult).toHaveLength(2);
  });

  it("eslint-disable rule", () => {
    const code = `
<!-- eslint-disable @html-eslint/no-inline-styles -->
<div style="foo"></div>
      `;
    const rule = {
      "@html-eslint/no-inline-styles": "error",
    };
    const legacyResult = legacyLinter.lint(code, rule);
    expect(legacyResult).toHaveLength(0);
    const languageResult = languageLinter.lint(code, rule);
    expect(languageResult).toHaveLength(0);
  });
  it("eslint-disable-next-line rule", () => {
    const code = `
<!-- eslint-disable-next-line @html-eslint/require-img-alt -->
<img src="/some/path"></img>
  `;
    const rule = {
      "@html-eslint/require-img-alt": "error",
    };
    const legacyResult = legacyLinter.lint(code, rule);
    expect(legacyResult).toHaveLength(0);
    const languageResult = languageLinter.lint(code, rule);
    expect(languageResult).toHaveLength(0);
  });
});
