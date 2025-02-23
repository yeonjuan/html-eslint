const { runESLint } = require("../lib/test-utils");

describe("frontmatter tests", () => {
  describe("eslint-v8-legacy-config", () => {
    it("should not throw any lint error for valid.html ", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config-frontmatter",
        glob: "valid.html",
        eslintVersion: "8",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);
    }, 20000);

    it("should not throw an lint error for invalid.html ", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v8-legacy-config-frontmatter",
        glob: "invalid.html",
        eslintVersion: "8",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(1);
      expect(htmlResult[0].messages[0]).toMatchInlineSnapshot(`
        {
          "column": 1,
          "endColumn": 1,
          "endLine": 9,
          "line": 9,
          "message": "Expected indentation of 4 space but found no indent.",
          "messageId": "wrongIndent",
          "nodeType": null,
          "ruleId": "@html-eslint/indent",
          "severity": 2,
        }
      `);
    }, 20000);
  });

  describe("eslint-v9-flat-config", () => {
    it("should not throw any lint error for valid.html ", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v9-flat-config-frontmatter",
        glob: "valid.html",
        eslintVersion: "8",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(0);
    }, 20000);

    it("should not throw an lint error for invalid.html ", async () => {
      const htmlResult = await runESLint({
        fixtureName: "eslint-v9-flat-config-frontmatter",
        glob: "invalid.html",
        eslintVersion: "8",
      });
      expect(htmlResult[0].fatalErrorCount).toBe(0);
      expect(htmlResult[0].messages.length).toBe(1);
      expect(htmlResult[0].messages[0]).toMatchInlineSnapshot(`
        {
          "column": 1,
          "endColumn": 1,
          "endLine": 9,
          "line": 9,
          "message": "Expected indentation of 2 space but found no indent.",
          "messageId": "wrongIndent",
          "nodeType": null,
          "ruleId": "html/indent",
          "severity": 2,
        }
      `);
    }, 20000);
  });
});
