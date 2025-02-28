const ESLint = require("eslint");

function getLinter() {
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
        plugins: {
          // @ts-ignore
          "@html-eslint": require("@html-eslint/eslint-plugin"),
        },
        languageOptions: {
          parser: require("@html-eslint/parser"),
        },
        rules: rulesConfig,
      });
    },
  };
}

describe("inline disable", () => {
  const linter = getLinter();
  it("eslint-disable all rules", () => {
    const result = linter.lint(
      `
       <!-- eslint-disable -->
        <div style="foo"></div>
        <div foo="foo" foo="foo"></div>
      `,
      {
        "@html-eslint/no-inline-styles": "error",
        "@html-eslint/no-duplicate-attrs": "error",
      }
    );
    expect(result).toHaveLength(0);
  });

  it("eslint-disable and enable all rules", () => {
    const result = linter.lint(
      `
       <!-- eslint-disable -->
       <div style="foo"></div>
       <!-- eslint-enable -->
        <div style="foo"></div>
        <div foo="foo" foo="foo"></div>
      `,
      {
        "@html-eslint/no-inline-styles": "error",
        "@html-eslint/no-duplicate-attrs": "error",
      }
    );
    expect(result).toHaveLength(2);
  });

  it("eslint-disable rule", () => {
    const result = linter.lint(
      `
       <!-- eslint-disable @html-eslint/no-inline-styles -->
        <div style="foo"></div>
      `,
      {
        "@html-eslint/no-inline-styles": "error",
      }
    );
    expect(result).toHaveLength(0);
  });
  it("eslint-disable-next-line rule", () => {
    const result = linter.lint(
      `
        <!-- eslint-disable-next-line @html-eslint/require-img-alt -->
        <img src="/some/path"></img>
      `,
      {
        "@html-eslint/require-img-alt": "error",
      }
    );
    expect(result).toHaveLength(0);
  });
});
