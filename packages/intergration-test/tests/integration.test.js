const { runESLint } = require("../lib/test-utils");

describe("integration tests", () => {
  describe("eslint-v8-legacy-config", () => {
    it("should throw a lint error for invalid.html and invalid.js", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        glob: "invalid.html",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const jsResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        glob: "invalid.js",
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBeGreaterThanOrEqual(1);
    });
    it("should not throw any lint error for valid.html and valid.js", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        glob: "valid.html",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);

      const jsResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config",
        glob: "valid.js",
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBe(0);
    });
  });

  describe("eslint-v9-flat-config", () => {
    it("should throw a lint error for invalid.html and invalid.js", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v9-flat-config",
        glob: "invalid.html",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBeGreaterThanOrEqual(1);

      const jsResult = await runESLint({
        fixtureName: "eslint-v9-flat-config",
        glob: "invalid.js",
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBeGreaterThanOrEqual(1);
    });
    it("should not throw any lint error for valid.html and valid.js", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v9-flat-config",
        glob: "valid.html",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);

      const jsResult = await runESLint({
        fixtureName: "eslint-v9-flat-config",
        glob: "valid.js",
      });
      expect(jsResult[0].fatalErrorCount).toBe(0);
      expect(jsResult[0].messages.length).toBe(0);
    });
  });
});
