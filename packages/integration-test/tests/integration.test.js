const { runESLint, runTypecheck } = require("../lib/test-utils");

describe("integration tests", () => {
  describe("eslint-v8-legacy-config", () => {
    it("should throw a lint error for invalid files", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        glob: "html/invalid.html",
        eslintVersion: "8",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const jsResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        glob: "js/invalid.js",
        eslintVersion: "8",
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const frontmatterResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        glob: "frontmatter/invalid.html",
        eslintVersion: "8",
      });
      expect(frontmatterResult[0].fatalErrorCount).toBe(0);
      expect(frontmatterResult[0].messages.length).toBeGreaterThanOrEqual(1);
    }, 20000);

    it("should not throw any lint error for valid files", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        eslintVersion: "8",
        glob: "html/valid.html",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);

      const jsResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        eslintVersion: "8",
        glob: "js/valid.js",
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBe(0);

      const frontmatterResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        glob: "frontmatter/valid.html",
        eslintVersion: "8",
      });
      expect(frontmatterResult[0].fatalErrorCount).toBe(0);
      expect(frontmatterResult[0].messages.length).toBeGreaterThanOrEqual(1);
    }, 20000);
  });

  describe("eslint-v9-flat-config", () => {
    it("should throw a lint error for invalid files", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v9-flat-config",
        eslintVersion: "9",
        glob: "html/invalid.html",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const jsResult = await runESLint({
        fixtureName: "eslint-v9-flat-config",
        eslintVersion: "9",
        glob: "js/invalid.js",
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const frontmatterResult = await runESLint({
        fixtureName: "eslint-v9-flat-config",
        eslintVersion: "9",
        glob: "frontmatter/invalid.html",
      });
      expect(frontmatterResult[0].fatalErrorCount).toBe(0);
      expect(frontmatterResult[0].messages.length).toBeGreaterThanOrEqual(1);
    }, 20000);

    it("should not throw any lint error for valid files", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v9-flat-config",
        eslintVersion: "9",
        glob: "html/valid.html",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);

      const jsResult = await runESLint({
        fixtureName: "eslint-v9-flat-config",
        eslintVersion: "9",
        glob: "js/valid.js",
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBe(0);

      const frontmatterResult = await runESLint({
        fixtureName: "eslint-v9-flat-config",
        eslintVersion: "9",
        glob: "frontmatter/valid.html",
      });
      expect(frontmatterResult[0].fatalErrorCount).toBe(0);
      expect(frontmatterResult[0].messages.length).toBeGreaterThanOrEqual(1);
    }, 20000);
  });

  describe("eslint-v9-language", () => {
    it("should not throw any lint error for valid files", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v9-language",
        eslintVersion: "9",
        glob: "html/valid.html",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);
    }, 20000);
  });

  describe("typescript", () => {
    it("should not throw any type error", async () => {
      const result927 = await runTypecheck({
        fixtureName: "typescript",
        eslintVersion: "9.27.0",
        fileName: "eslint.config.ts",
      });
      expect(result927).toBe(undefined);

      const result9392 = await runTypecheck({
        fixtureName: "typescript",
        eslintVersion: "9.39.2",
        fileName: "eslint.config.ts",
      });
      expect(result9392).toBe(undefined);
    });
  });
});
