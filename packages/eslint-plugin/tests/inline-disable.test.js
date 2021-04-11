const ESLint = require("eslint");
const parser = require("@html-eslint/parser");
const rules = require("../lib/rules");

const SCOPE = "@html-eslint";
const PARSER = `${SCOPE}/parser`;

function prefixPluginNameReducer(rules, [key, value]) {
  rules[`${SCOPE}/${key}`] = value;
  return rules;
}

function getLinter() {
  const linter = new ESLint.Linter();
  linter.defineParser(PARSER, parser);
  linter.defineRules(Object.entries(rules).reduce(prefixPluginNameReducer, {}));

  return {
    lint(code, rulesConfig) {
      return linter.verify(code, {
        parser: PARSER,
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
