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

  describe("template comments", () => {
    const { TEMPLATE_ENGINE_SYNTAX } = require("@html-eslint/parser");

    const templateLegacyLinter = getLinter({
      ...LEGACY_OPTIONS,
      languageOptions: {
        ...LEGACY_OPTIONS.languageOptions,
        parserOptions: {
          templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
        },
      },
    });
    const templateLanguageLinter = getLinter({
      plugins: LANGUAGE_OPTIONS.plugins,
      language: "@html-eslint/html",
      languageOptions: {
        templateEngineSyntax: TEMPLATE_ENGINE_SYNTAX.TWIG,
      },
    });

    it("eslint-disable-next-line rule", () => {
      const code = `
{# eslint-disable-next-line @html-eslint/require-img-alt -- Decorative #}
<img src="/some/path">
<img src="/some/path">
  `;
      const rule = {
        "@html-eslint/require-img-alt": "error",
      };
      const legacyResult = templateLegacyLinter.lint(code, rule);
      expect(legacyResult).toHaveLength(1);
      expect(legacyResult[0].line).toBe(4);
      const languageResult = templateLanguageLinter.lint(code, rule);
      expect(languageResult).toHaveLength(1);
      expect(languageResult[0].line).toBe(4);
    });

    it("eslint-disable and enable rule", () => {
      const code = `
{# eslint-disable @html-eslint/no-inline-styles #}
<div style="foo"></div>
{# eslint-enable @html-eslint/no-inline-styles #}
<div style="foo"></div>
  `;
      const rule = {
        "@html-eslint/no-inline-styles": "error",
      };
      const legacyResult = templateLegacyLinter.lint(code, rule);
      expect(legacyResult).toHaveLength(1);
      expect(legacyResult[0].line).toBe(5);
      const languageResult = templateLanguageLinter.lint(code, rule);
      expect(languageResult).toHaveLength(1);
      expect(languageResult[0].line).toBe(5);
    });

    it("parses template comments that hold other delimiters", () => {
      const code = `
{# <img src="{{ old }}"> #}
<img src="/some/path">
  `;
      const rule = {
        "@html-eslint/require-img-alt": "error",
      };
      const legacyResult = templateLegacyLinter.lint(code, rule);
      expect(legacyResult).toHaveLength(1);
      expect(legacyResult[0].line).toBe(3);
      const languageResult = templateLanguageLinter.lint(code, rule);
      expect(languageResult).toHaveLength(1);
      expect(languageResult[0].line).toBe(3);
    });

    it("ignores template comments that are not directives", () => {
      const code = `
{# A note #}
<img src="/some/path">
  `;
      const rule = {
        "@html-eslint/require-img-alt": "error",
      };
      expect(templateLegacyLinter.lint(code, rule)).toHaveLength(1);
      expect(templateLanguageLinter.lint(code, rule)).toHaveLength(1);
    });
  });
});
