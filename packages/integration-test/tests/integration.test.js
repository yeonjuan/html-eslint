const { runESLint, runTypecheck } = require("../lib/test-utils");

function expectLintResult(result, { shouldHaveErrors = false } = {}) {
  expect(result[0].fatalErrorCount).toBe(0);
  if (shouldHaveErrors) {
    expect(result[0].messages.length).toBeGreaterThanOrEqual(1);
  } else {
    expect(result[0].messages.length).toBe(0);
  }
}

async function testESLintFiles({
  fixtureName,
  eslintVersion,
  localPackages,
  files,
  shouldHaveErrors = false,
}) {
  for (const file of files) {
    const result = await runESLint({
      fixtureName,
      eslintVersion,
      localPackages,
      glob: file,
      log: !shouldHaveErrors,
    });
    expectLintResult(result, { shouldHaveErrors });
  }
}

/** Create standard test suite for ESLint configuration */
function createESLintConfigTests({
  eslintVersion,
  fixtureName,
  localPackages,
  invalidFiles = [
    "html/invalid.html",
    "js/invalid.js",
    "frontmatter/invalid.html",
  ],
  validFiles = ["html/valid.html", "js/valid.js", "frontmatter/valid.html"],
  testTimeout = 20000,
}) {
  const config = { eslintVersion, fixtureName, localPackages };

  if (invalidFiles.length > 0) {
    it(
      "should throw a lint error for invalid files",
      async () => {
        await testESLintFiles({
          ...config,
          files: invalidFiles,
          shouldHaveErrors: true,
        });
      },
      testTimeout
    );
  }

  if (validFiles.length > 0) {
    it(
      "should not throw any lint error for valid files",
      async () => {
        await testESLintFiles({
          ...config,
          files: validFiles,
          shouldHaveErrors: false,
        });
      },
      testTimeout
    );
  }
}

describe("integration tests", () => {
  describe("eslint-v8-legacy-config", () => {
    createESLintConfigTests({
      eslintVersion: "8",
      fixtureName: "eslint-v8-legacy-config",
      localPackages: ["@html-eslint/eslint-plugin", "@html-eslint/parser"],
    });
  });

  describe("eslint-v9-flat-config", () => {
    createESLintConfigTests({
      eslintVersion: "9",
      fixtureName: "eslint-v9-flat-config",
      localPackages: ["@html-eslint/eslint-plugin", "@html-eslint/parser"],
    });
  });

  describe("eslint-v9-language", () => {
    createESLintConfigTests({
      eslintVersion: "9",
      fixtureName: "eslint-v9-language",
      localPackages: ["@html-eslint/eslint-plugin"],
      invalidFiles: [],
      validFiles: ["html/valid.html"],
    });
  });

  describe("eslint-v10-flat-config", () => {
    createESLintConfigTests({
      eslintVersion: "10",
      fixtureName: "eslint-v10-flat-config",
      localPackages: ["@html-eslint/eslint-plugin", "@html-eslint/parser"],
    });
  });

  describe("typescript", () => {
    const eslintVersion = "9.27.0";
    const fixtureName = "typescript";
    const localPackages = ["@html-eslint/eslint-plugin"];

    it("should not throw any type error", async () => {
      const result = await runTypecheck({
        fixtureName,
        eslintVersion,
        localPackages,
        fileName: "eslint.config.ts",
        log: true,
      });
      expect(result).toBe(undefined);
    }, 20000);
  });

  describe("react", () => {
    createESLintConfigTests({
      eslintVersion: "9.27.0",
      fixtureName: "react",
      localPackages: ["@html-eslint/eslint-plugin-react"],
      invalidFiles: ["jsx/invalid.jsx"],
      validFiles: ["jsx/valid.jsx"],
    });
  });
});
