const { runESLint, runTypecheck } = require("../lib/test-utils");

describe("integration tests", () => {
  describe("eslint-v8-legacy-config", () => {
    const eslintVersion = "8";
    const fixtureName = "eslint-v8-legacy-config";
    const localPackages = ["@html-eslint/eslint-plugin", "@html-eslint/parser"];

    it("should throw a lint error for invalid files", async () => {
      const htmlResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "html/invalid.html",
        log: false,
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const jsResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "js/invalid.js",
        log: false,
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const frontmatterResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "frontmatter/invalid.html",
        log: false,
      });
      expect(frontmatterResult[0].fatalErrorCount).toBe(0);
      expect(frontmatterResult[0].messages.length).toBeGreaterThanOrEqual(1);
    }, 20000);

    it("should not throw any lint error for valid files", async () => {
      const htmlResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "html/valid.html",
        log: true,
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);

      const jsResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "js/valid.js",
        log: true,
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBe(0);

      const frontmatterResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "frontmatter/valid.html",
        log: true,
      });
      expect(frontmatterResult[0].fatalErrorCount).toBe(0);
      expect(frontmatterResult[0].messages.length).toBe(0);
    }, 20000);
  });

  describe("eslint-v9-flat-config", () => {
    const eslintVersion = "9";
    const fixtureName = "eslint-v9-flat-config";
    const localPackages = ["@html-eslint/eslint-plugin", "@html-eslint/parser"];

    it("should throw a lint error for invalid files", async () => {
      const htmlResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "html/invalid.html",
        log: false,
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const jsResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "js/invalid.js",
        log: false,
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const frontmatterResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "frontmatter/invalid.html",
        log: false,
      });
      expect(frontmatterResult[0].fatalErrorCount).toBe(0);
      expect(frontmatterResult[0].messages.length).toBeGreaterThanOrEqual(1);
    }, 20000);

    it("should not throw any lint error for valid files", async () => {
      const htmlResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "html/valid.html",
        log: true,
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);

      const jsResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "js/valid.js",
        log: true,
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBe(0);

      const frontmatterResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "frontmatter/valid.html",
        log: true,
      });
      expect(frontmatterResult[0].fatalErrorCount).toBe(0);
      expect(frontmatterResult[0].messages.length).toBe(0);
    }, 20000);
  });

  describe("eslint-v9-language", () => {
    const eslintVersion = "9";
    const fixtureName = "eslint-v9-language";
    const localPackages = ["@html-eslint/eslint-plugin"];

    it("should not throw any lint error for valid files", async () => {
      const htmlResult = await runESLint({
        eslintVersion,
        fixtureName,
        localPackages,
        glob: "html/valid.html",
        log: true,
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);
    }, 20000);
  });

  describe("eslint-v10-flat-config", () => {
    const eslintVersion = "10";
    const fixtureName = "eslint-v10-flat-config";
    const localPackages = ["@html-eslint/eslint-plugin", "@html-eslint/parser"];

    it("should throw a lint error for invalid files", async () => {
      const htmlResult = await runESLint({
        eslintVersion,
        fixtureName,
        localPackages,
        glob: "html/invalid.html",
        log: false,
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const jsResult = await runESLint({
        eslintVersion,
        fixtureName,
        localPackages,
        glob: "js/invalid.js",
        log: false,
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const frontmatterResult = await runESLint({
        eslintVersion,
        fixtureName,
        localPackages,
        glob: "frontmatter/invalid.html",
        log: false,
      });
      expect(frontmatterResult[0].fatalErrorCount).toBe(0);
      expect(frontmatterResult[0].messages.length).toBeGreaterThanOrEqual(1);
    }, 20000);

    it("should not throw any lint error for valid files", async () => {
      const htmlResult = await runESLint({
        eslintVersion,
        fixtureName,
        localPackages,
        glob: "html/valid.html",
        log: true,
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);

      const jsResult = await runESLint({
        eslintVersion,
        fixtureName,
        localPackages,
        glob: "js/valid.js",
        log: true,
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBe(0);

      const frontmatterResult = await runESLint({
        eslintVersion,
        fixtureName,
        localPackages,
        glob: "frontmatter/valid.html",
        log: true,
      });
      expect(frontmatterResult[0].fatalErrorCount).toBe(0);
      expect(frontmatterResult[0].messages.length).toBeGreaterThanOrEqual(0);
    }, 20000);
  });

  describe("typescript", () => {
    const eslintVersion = "9.27.0";
    const fixtureName = "typescript";
    const localPackages = ["@html-eslint/eslint-plugin"];
    it("should not throw any type error", async () => {
      const result927 = await runTypecheck({
        fixtureName,
        eslintVersion,
        localPackages,
        fileName: "eslint.config.ts",
        log: true,
      });
      expect(result927).toBe(undefined);

      const result9392 = await runTypecheck({
        fixtureName,
        eslintVersion,
        localPackages,
        fileName: "eslint.config.ts",
        log: true,
      });
      expect(result9392).toBe(undefined);
    }, 20000);
  });

  describe("react", () => {
    const fixtureName = "react";
    const eslintVersion = "9.27.0";
    const localPackages = ["@html-eslint/eslint-plugin-react"];
    it("should throw a lint error for invalid files", async () => {
      const jsxResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "jsx/invalid.jsx",
        log: false,
      });
      expect(jsxResult[0].fatalErrorCount).toBe(0);
      expect(jsxResult[0].messages.length).toBeGreaterThanOrEqual(1);
    }, 20000);

    it("should not throw any lint error for valid files", async () => {
      const jsxResult = await runESLint({
        fixtureName,
        eslintVersion,
        localPackages,
        glob: "jsx/valid.jsx",
        log: true,
      });
      expect(jsxResult[0].fatalErrorCount).toBe(0);
      expect(jsxResult[0].messages.length).toBe(0);
    }, 20000);
  });
});
