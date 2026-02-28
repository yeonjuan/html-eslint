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
  externalPackages = [],
  files,
  shouldHaveErrors = false,
  packageManager = "yarn",
}) {
  for (const file of files) {
    const result = await runESLint({
      fixtureName,
      eslintVersion,
      localPackages,
      externalPackages,
      glob: file,
      log: !shouldHaveErrors,
      packageManager,
    });
    expectLintResult(result, { shouldHaveErrors });
  }
}

/** Create standard test suite for ESLint configuration */
function createESLintConfigTests({
  eslintVersion,
  fixtureName,
  localPackages,
  externalPackages = [],
  invalidFiles = [
    "html/invalid.html",
    "js/invalid.js",
    "frontmatter/invalid.html",
  ],
  validFiles = ["html/valid.html", "js/valid.js", "frontmatter/valid.html"],
  testTimeout = 20000,
  packageManager = "yarn",
}) {
  const config = {
    eslintVersion,
    fixtureName,
    localPackages,
    externalPackages,
    packageManager,
  };

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
    describe("with yarn", () => {
      createESLintConfigTests({
        eslintVersion: "8",
        fixtureName: "eslint-v8-legacy-config",
        localPackages: ["@html-eslint/eslint-plugin", "@html-eslint/parser"],
      });
    });

    describe("with pnpm", () => {
      createESLintConfigTests({
        eslintVersion: "8",
        fixtureName: "eslint-v8-legacy-config",
        localPackages: ["@html-eslint/eslint-plugin", "@html-eslint/parser"],
        packageManager: "pnpm",
      });
    });
  });

  describe("eslint-v9-flat-config", () => {
    describe("with yarn", () => {
      createESLintConfigTests({
        eslintVersion: "9",
        fixtureName: "eslint-v9-flat-config",
        localPackages: ["@html-eslint/eslint-plugin", "@html-eslint/parser"],
      });
    });

    describe("with pnpm", () => {
      createESLintConfigTests({
        eslintVersion: "9",
        fixtureName: "eslint-v9-flat-config",
        localPackages: ["@html-eslint/eslint-plugin", "@html-eslint/parser"],
        packageManager: "pnpm",
      });
    });
  });

  describe("eslint-v9-language", () => {
    describe("with yarn", () => {
      createESLintConfigTests({
        eslintVersion: "9",
        fixtureName: "eslint-v9-language",
        localPackages: ["@html-eslint/eslint-plugin"],
        invalidFiles: [],
        validFiles: ["html/valid.html", "frontmatter/valid.html"],
      });
    });

    describe("with pnpm", () => {
      createESLintConfigTests({
        eslintVersion: "9",
        fixtureName: "eslint-v9-language",
        localPackages: ["@html-eslint/eslint-plugin"],
        invalidFiles: [],
        validFiles: ["html/valid.html", "frontmatter/valid.html"],
        packageManager: "pnpm",
      });
    });
  });

  describe("eslint-v10-flat-config", () => {
    describe("with yarn", () => {
      createESLintConfigTests({
        eslintVersion: "10",
        fixtureName: "eslint-v10-flat-config",
        localPackages: ["@html-eslint/eslint-plugin", "@html-eslint/parser"],
      });
    });

    describe("with pnpm", () => {
      createESLintConfigTests({
        eslintVersion: "10",
        fixtureName: "eslint-v10-flat-config",
        localPackages: ["@html-eslint/eslint-plugin", "@html-eslint/parser"],
        packageManager: "pnpm",
      });
    });
  });

  describe("typescript", () => {
    const eslintVersion = "9.27.0";
    const fixtureName = "typescript";
    const localPackages = ["@html-eslint/eslint-plugin"];
    const externalPackages = [["typescript", "5.9.3"]];

    describe("with yarn", () => {
      it("should not throw any type error", async () => {
        const result = await runTypecheck({
          fixtureName,
          eslintVersion,
          localPackages,
          externalPackages,
          fileName: "eslint.config.ts",
        });
        expect(result).toBe(undefined);
      }, 20000);
    });

    describe("with pnpm", () => {
      it("should not throw any type error", async () => {
        const result = await runTypecheck({
          fixtureName,
          eslintVersion,
          localPackages,
          externalPackages,
          fileName: "eslint.config.ts",
          packageManager: "pnpm",
        });
        expect(result).toBe(undefined);
      }, 20000);
    });
  });

  describe("react", () => {
    describe("with yarn", () => {
      createESLintConfigTests({
        eslintVersion: "9.27.0",
        fixtureName: "react",
        localPackages: ["@html-eslint/eslint-plugin-react"],
        invalidFiles: ["jsx/invalid.jsx"],
        validFiles: ["jsx/valid.jsx"],
      });
    });

    describe("with pnpm", () => {
      createESLintConfigTests({
        eslintVersion: "9.27.0",
        fixtureName: "react",
        localPackages: ["@html-eslint/eslint-plugin-react"],
        invalidFiles: ["jsx/invalid.jsx"],
        validFiles: ["jsx/valid.jsx"],
        packageManager: "pnpm",
      });
    });
  });

  describe("svelte", () => {
    createESLintConfigTests({
      eslintVersion: "9",
      fixtureName: "svelte",
      localPackages: ["@html-eslint/eslint-plugin-svelte"],
      externalPackages: [
        ["eslint-plugin-svelte", "3.15.0"],
        ["svelte", "5"],
      ],
      invalidFiles: ["svelte/invalid.svelte"],
      validFiles: ["svelte/valid.svelte"],
    });
  });

  describe("angular", () => {
    createESLintConfigTests({
      eslintVersion: "9.27.0",
      fixtureName: "angular-template",
      log: true,
      localPackages: ["@html-eslint/eslint-plugin-angular-template"],
      extraDependencies: { "@angular-eslint/template-parser": "^21.2.0" },
      invalidFiles: ["templates/invalid.html"],
      validFiles: ["templates/valid.html"],
    });
  });
});
